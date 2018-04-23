# Typescript Web Application Template

Work in progress template for cloning

## Instructions

1. Get Docker
2. `$ docker-compose up`

## Capabilities out of the box

- Express server powered using TypeScript friendly `routing-controllers` and `type-orm`
- All the boring user management boilerplate
- E2E tests for all boilerplated API
- Server side rendering of React TSX files, including email

## To-dos

- Fixtures for e2e testing
- User CRUD
  - Password email reset
  - Email confirmation status
    - User creation via email reset flow (i.e. confirmation)
    - Device Authorization via email

- Todo Management
  - CRUD Todo List
  - CRUD Todo List Item

### Nice to have

- Swagger docs generation support
- iOS Push Notification support
- Google OAuth Signup
- Facebook OAuth Signup
- Twitter OAuth Signup
- Redis Cache Layer