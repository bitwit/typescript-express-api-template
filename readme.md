# Typescript Web Application Template

Work in progress template for cloning to rapidly build new APIs

## Instructions

1. Get Docker
2. `$ docker-compose up`

## Goals

The intention of this application is to help with two key things
1. To bootstrap an application with most of the mundane REST API work done already
2. Structure / Best practices solidified

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
  - Robust config file
    - Include detail oriented things such as (these are at least needed for Apple Apps, so they should be on the checklist):
      - Url to Terms and Conditions
      - Url Privacy Policy

- Todo Management
  - CRUD Todo List
  - CRUD Todo List Item

- Static assets docker image
  - Basic Single Page Application


### Nice to have

- iOS Push Notification support
- Google OAuth Signup
- Facebook OAuth Signup
- Twitter OAuth Signup
- Redis Cache Layer
