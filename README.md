# Worker + D1 Database API Example

This project demonstrates a Cloudflare Worker with a D1 database binding for a sample "presenters" API. All endpoints require **two** HTTP headers:

```
X-API-Key: a5d1bdba-ee88-46f2-a62e-2d0edb159a21
X-Event-Key: PÄRNU25
```

- The `X-API-Key` is the authentication key for access.
- The `X-Event-Key` must be set to `PÄRNU25`.  
  You can change the required event key directly in [`src/index.ts`](src/index.ts).

Replace `https://vision-2026-call-for-presenters-backend.cloudflare-one-offs.workers.dev` in the examples below with your deployed Worker URL, or use `http://localhost:8787` if running locally.

## Endpoints

- `GET    /api/presenters`           → Get all presenters
- `GET    /api/presenters/:id`       → Get a single presenter by ID
- `POST   /api/presenters`           → Create a presenter (fields: name, topic, bio)
- `PUT    /api/presenters/:id`       → Update a presenter by ID (fields: name, topic, bio)
- `DELETE /api/presenters/:id`       → Delete a presenter by ID

## Example Usage (ready to copy)

### Get all presenters

```sh
curl -X GET https://vision-2026-call-for-presenters-backend.cloudflare-one-offs.workers.dev/api/presenters \
  -H "X-API-Key: a5d1bdba-ee88-46f2-a62e-2d0edb159a21" \
  -H "X-Event-Key: PÄRNU25"
```

### Get presenter with ID 1

```sh
curl -X GET https://vision-2026-call-for-presenters-backend.cloudflare-one-offs.workers.dev/api/presenters/1 \
  -H "X-API-Key: a5d1bdba-ee88-46f2-a62e-2d0edb159a21" \
  -H "X-Event-Key: PÄRNU25"
```

### Add a presenter

```sh
curl -X POST https://vision-2026-call-for-presenters-backend.cloudflare-one-offs.workers.dev/api/presenters \
  -H "X-API-Key: a5d1bdba-ee88-46f2-a62e-2d0edb159a21" \
  -H "X-Event-Key: PÄRNU25" \
  -H "Content-Type: application/json" \
  --data '{"name":"Ada Lovelace", "topic":"Computing", "bio":"The first programmer."}'
```

### Update presenter with ID 1

```sh
curl -X PUT https://vision-2026-call-for-presenters-backend.cloudflare-one-offs.workers.dev/api/presenters/1 \
  -H "X-API-Key: a5d1bdba-ee88-46f2-a62e-2d0edb159a21" \
  -H "X-Event-Key: PÄRNU25" \
  -H "Content-Type: application/json" \
  --data '{"name":"Ada Lovelace", "topic":"Math & Computing", "bio":"Pioneer in computer science."}'
```

### Delete presenter with ID 1

```sh
curl -X DELETE https://vision-2026-call-for-presenters-backend.cloudflare-one-offs.workers.dev/api/presenters/1 \
  -H "X-API-Key: a5d1bdba-ee88-46f2-a62e-2d0edb159a21" \
  -H "X-Event-Key: PÄRNU25"
```

---

All endpoints return JSON. The sample API key and event key are hardcoded for demonstration and can be changed in the code.

## Setup & Deploy

Follow the instructions below to set up and deploy your Worker and D1 database.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create your D1 database:
   ```bash
   npx wrangler d1 create d1-template-database
   ```
   Update your `wrangler.json` with the database ID.
3. Run migrations:
   ```bash
   npx wrangler d1 migrations apply --remote d1-template-database
   ```
4. Deploy:
   ```bash
   npx wrangler deploy
   ```
