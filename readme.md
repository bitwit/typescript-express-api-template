# Typescript Web Application Template

Work in progress template for cloning

## Instructions

1. Get Docker
2. `$ docker-compose up`

## Capabilities out of the box

- Express server powered using TypeScript friendly `routing-controllers` and `type-orm`
- All the boring user management boilerplate
- Server side rendering of React TSX files, including email
- Automatic Swagger docs generation generated from `routing-controllers` decorators and return types
- E2E tests for all boilerplated API
  - Fixtures for e2e testing

## To-dos

- User CRUD
  - Email confirmation status
  - User creation via email reset flow (i.e. confirmation)
  - Device Authorization via email

- Proper Prod/Staging environment settings for both building and running
  - Docs generation for prod build flow only, or on demand

- Todo Management
  - CRUD Todo List
  - CRUD Todo List Item

### Nice to have

- iOS Push Notification support
- Google OAuth Signup
- Facebook OAuth Signup
- Twitter OAuth Signup
- Redis Cache Layer
