# NestJS File-service

The repository provides examples of the main toolkit used to write a basic service on the NestJS framework.

## Required

1. NodeJS v16.15.0
2. Postgres 12

## Pre use required

`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

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

4. Create db_config.json file from db_config.json.example or use

```
npx sequelize-cli init
```

5. Sync database.

```
pnpm sync
```

6. Run migrations.

```
npx sequelize-cli db:migration
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
