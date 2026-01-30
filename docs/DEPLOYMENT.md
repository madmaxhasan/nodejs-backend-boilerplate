# Deployment Guide

Complete guide for deploying the application to production.

## Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] JWT secrets generated (min 32 characters)
- [ ] CORS origins configured
- [ ] Rate limits adjusted for production
- [ ] Logging level set appropriately
- [ ] All tests passing
- [ ] Code linted and formatted
- [ ] Dependencies updated
- [ ] Security audit completed

## Environment Setup

### 1. Generate Secure Secrets

```bash
# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Production Environment Variables

```env
NODE_ENV=production
PORT=5000
API_PREFIX=/api/v1

MONGODB_URI=mongodb://username:password@host:port/database
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

JWT_ACCESS_SECRET=your-64-character-secret-here
JWT_REFRESH_SECRET=another-64-character-secret-here
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

CORS_ORIGIN=https://yourdomain.com

RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

LOG_LEVEL=info
```

## Deployment Options

### Option 1: Docker Deployment

#### Using Docker Compose

```bash
# 1. Copy environment file
cp .env.example .env
# Edit .env with production values

# 2. Build and start services
docker-compose -f docker/docker-compose.yml up -d

# 3. View logs
docker-compose -f docker/docker-compose.yml logs -f app

# 4. Stop services
docker-compose -f docker/docker-compose.yml down
```

#### Using Docker Standalone

```bash
# 1. Build image
docker build -f docker/Dockerfile -t nodejs-backend:1.0.0 .

# 2. Run container
docker run -d \
  --name nodejs-backend \
  -p 5000:5000 \
  --env-file .env \
  nodejs-backend:1.0.0

# 3. View logs
docker logs -f nodejs-backend

# 4. Stop container
docker stop nodejs-backend
docker rm nodejs-backend
```

### Option 2: PM2 Deployment

```bash
# 1. Install dependencies
yarn install --production

# 2. Install PM2 globally
npm install -g pm2

# 3. Start application
pm2 start pm2.config.js

# 4. Save PM2 configuration
pm2 save

# 5. Setup startup script
pm2 startup
# Follow the instructions from the command output

# 6. Monitor application
pm2 monit

# 7. View logs
pm2 logs

# 8. Restart application
pm2 restart all

# 9. Stop application
pm2 stop all
```

### Option 3: Cloud Platforms

#### Heroku

```bash
# 1. Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# 2. Login to Heroku
heroku login

# 3. Create application
heroku create your-app-name

# 4. Add MongoDB addon
heroku addons:create mongolab

# 5. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_ACCESS_SECRET=your-secret
heroku config:set JWT_REFRESH_SECRET=your-secret
# Set other required variables

# 6. Deploy
git push heroku main

# 7. View logs
heroku logs --tail
```

#### AWS EC2

```bash
# 1. SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-instance-ip

# 2. Install Node.js and Yarn
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g yarn

# 3. Clone repository
git clone your-repo-url
cd nodejs-backend-boilerplate

# 4. Install dependencies
yarn install --production

# 5. Setup environment
cp .env.example .env
# Edit .env with production values

# 6. Install PM2
npm install -g pm2

# 7. Start application
pm2 start pm2.config.js

# 8. Setup startup script
pm2 startup systemd
pm2 save

# 9. Setup Nginx reverse proxy
sudo apt-get install nginx
# Configure Nginx (see below)
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### DigitalOcean App Platform

```yaml
# .do/app.yaml
name: nodejs-backend
services:
  - name: api
    github:
      repo: your-username/your-repo
      branch: main
      deploy_on_push: true
    build_command: yarn install
    run_command: yarn start
    envs:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: '8080'
      - key: JWT_ACCESS_SECRET
        type: SECRET
      - key: JWT_REFRESH_SECRET
        type: SECRET
      - key: MONGODB_URI
        type: SECRET
    http_port: 8080
    instance_count: 1
    instance_size_slug: basic-xxs
databases:
  - name: mongodb
    engine: MONGODB
```

## Database Setup

### MongoDB Atlas (Recommended)

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Add database user
4. Whitelist IP addresses (or allow from anywhere: 0.0.0.0/0)
5. Get connection string
6. Update `MONGODB_URI` in environment

### Self-Hosted MongoDB

```bash
# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Secure MongoDB
mongo
> use admin
> db.createUser({
  user: "admin",
  pwd: "secure-password",
  roles: ["root"]
})
> exit

# Update mongod.conf
sudo nano /etc/mongod.conf
# Enable authentication
security:
  authorization: enabled
```

## SSL/TLS Setup

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is setup automatically
# Test renewal
sudo certbot renew --dry-run
```

## Monitoring

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Web dashboard
pm2 plus
```

### Log Management

```bash
# View logs
pm2 logs

# Save logs to file
pm2 logs > logs.txt

# Rotate logs
pm2 install pm2-logrotate
```

### Health Checks

Setup health check monitoring:

```bash
# Health check endpoint
curl http://localhost:5000/health

# Setup monitoring with UptimeRobot or Pingdom
```

## Backup Strategy

### Database Backups

```bash
# MongoDB backup script
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/path/to/backups
mongodump --uri="mongodb://..." --out="$BACKUP_DIR/backup_$TIMESTAMP"

# Cron job for daily backups
0 2 * * * /path/to/backup-script.sh
```

### Application Backups

```bash
# Backup entire application
tar -czf app-backup-$(date +%Y%m%d).tar.gz /path/to/app

# Store in S3 or similar
aws s3 cp app-backup-*.tar.gz s3://your-bucket/backups/
```

## Security Hardening

### Firewall Setup

```bash
# UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

### Updates

```bash
# Regular system updates
sudo apt-get update
sudo apt-get upgrade

# Regular dependency updates
yarn upgrade-interactive --latest
```

## Scaling

### Horizontal Scaling

Use PM2 cluster mode:

```javascript
// pm2.config.js
module.exports = {
  apps: [
    {
      instances: 'max', // or specific number
      exec_mode: 'cluster',
    },
  ],
};
```

### Load Balancing

Use Nginx as load balancer:

```nginx
upstream backend {
    server localhost:5000;
    server localhost:5001;
    server localhost:5002;
}

server {
    location / {
        proxy_pass http://backend;
    }
}
```

## Rollback Procedure

### Docker

```bash
# Rollback to previous image
docker pull nodejs-backend:previous-version
docker stop nodejs-backend
docker run ... nodejs-backend:previous-version
```

### PM2

```bash
# Keep previous version
cp -r current previous
# Deploy new version to current
# If issues, switch back
pm2 stop all
cd ../previous
pm2 start pm2.config.js
```

## Troubleshooting

### Common Issues

1. **Port already in use**

```bash
lsof -i :5000
kill -9 PID
```

2. **MongoDB connection failed**

- Check connection string
- Verify network access
- Check authentication

3. **High memory usage**

```bash
pm2 restart all
# Or adjust max memory
pm2 start app.js --max-memory-restart 1G
```

4. **Application crashes**

```bash
# Check logs
pm2 logs
# Check error logs
tail -f /var/log/nginx/error.log
```

## Post-Deployment

- [ ] Verify health endpoint
- [ ] Test authentication flow
- [ ] Check logs for errors
- [ ] Setup monitoring alerts
- [ ] Document deployment date
- [ ] Update team members
- [ ] Monitor performance metrics

## Support

For deployment issues, check:

- Application logs
- Database connectivity
- Environment variables
- Network configuration
- Security groups/firewall rules
