# NestJS File-service

The repository provides examples of the main toolkit used to write a basic service on the NestJS framework.

## Required

1. NodeJS v16.15.0
2. Postgres 12

## Pre use required

`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

## Project structure

```
test                                ─ e2e tests
src                                 ─ Source code
│   main.ts                         ─ App entrypoint
│
├───migrations                      ─ TypeORM migrations folder
│
├───app
│   │   app.module.ts               ─ Application module
│   └───auth
│       ├───guards                  ─ Auth guards implementations
│
├───────database
│       │   database.module.ts      ─ Database module with db connection
│
├───────files                       ─ Files module
│
├───────storage                     ─ Storage module
│
└───────utils                       ─ Utils.
```

## Files naming

```
{name}.{resource_type}.ts
{name}.{resource_type}.spec.ts - For unit tests.
```

## Service start

1. Create .env file from .env.example
2. Install node-modules

```
pnpm install
```

3. Build project

```
pnpm build
```

4. Create ormconfig.json file from ormconfig.json_template or use

```
npx typeorm init
```

5. Sync database.

```
pnpm sync
```

6. Run migrations.

```
npx typeorm:migration:run
```

7. Start tests

```
pnpm tests
```

8. Start server

```
pnpm start
```

9. Checkout swagger (Default: http://localhost:3050/api/documentation)

## Default server response

### Default success response (200):

```json
{
  "ok": true,
  "result": {}
}
```

### Default error response:

```json
{
  "ok": false,
  "code": 404000,
  "msg": "Not found.",
  "data": {}
}
```

### Default pagination 

`GET - /api/files?offset=10&limit=10`

Default response with server pagination:

```json
{
  "ok": true,
  "result": {
    "count": 10,
    "rows": []
  }
}
```
