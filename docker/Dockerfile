FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache tini

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production=false

COPY . .

RUN yarn install --frozen-lockfile --production && \
    yarn cache clean

USER node

EXPOSE 5000

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "src/index.js"]
