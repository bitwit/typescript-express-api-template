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
  - Password email reset
  - Email confirmation status
    - User creation via email reset flow (i.e. confirmation)
    - Device Authorization via email

- Todo Management
  - CRUD Todo List
  - CRUD Todo List Item

### Nice to have

- iOS Push Notification support
- Google OAuth Signup
- Facebook OAuth Signup
- Twitter OAuth Signup
- Redis Cache Layer
