# Contributing Guide

Thank you for considering contributing to this project! Here are some guidelines to help you get started.

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `yarn install`
3. Copy `.env.example` to `.env` and configure
4. Start MongoDB
5. Run the development server: `yarn dev`

## Code Standards

### Style Guide

- Use ES6+ features
- Follow Airbnb JavaScript style guide
- Use meaningful variable and function names
- Keep functions small and focused
- Write self-documenting code

### Commit Messages

Follow conventional commit format:

```
type(scope): subject

body

footer
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:

```
feat(auth): add password reset functionality

- Add password reset request endpoint
- Add password reset confirmation endpoint
- Send reset email with token

Closes #123
```

## Testing

- Write tests for all new features
- Ensure all tests pass before submitting PR
- Maintain code coverage above 70%

```bash
yarn test
```

## Pull Request Process

1. Create a feature branch from `develop`
2. Make your changes
3. Write/update tests
4. Run linter and fix any issues
5. Commit your changes
6. Push to your fork
7. Create a Pull Request

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No console logs or debug code
- [ ] Branch is up to date with base branch

## Code Review

- Be respectful and constructive
- Respond to all review comments
- Make requested changes promptly
- Ask questions if something is unclear

## Questions?

Open an issue for discussion before starting work on major changes.
