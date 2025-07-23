# Panahon Website

## Live Sites

- Main: [https://panahon.observatory.ph](https://panahon.observatory.ph)
- Mirror: [https://habagat.observatory.ph](https://habagat.observatory.ph)

## Requirements

- pnpm (preferred) / yarn / npm
- podman or docker (for deployment)
- Prisma CLI (`prisma`)
- Mapbox account for map visualizations

## Getting Started

### 1. Clone the Repository

```sh
git clone <repo-url>
cd <repo-directory>
```

### 2. Install Dependencies

```sh
pnpm install
```

### 3. Setup Database (with Prisma)

Configure your database URL in `.env` (`DATABASE_URL`).

```sh
prisma migrate dev
prisma generate
```

### 4. Development Server

```sh
pnpm dev
```

Access at: `http://localhost:<APP_PORT>`

## Production Build & Deployment

For production, use either Podman (preferred) or Docker for deployment.

```sh
pnpm deploy:podman
# pnpm deploy:docker
```

## Environment Configuration

Create a `.env` file at the root with the following required environment variables:

| Variable               | Description                                   | Example                                      |
| ---------------------- | --------------------------------------------- | -------------------------------------------- |
| `APP_HOST`             | Local IP/server bind address                  | `127.0.0.1`                                  |
| `APP_PORT`             | Server port                                   | `3000`                                       |
| `APP_SITE`             | Public site URL or identifier                 | `panahon.observatory.ph`                     |
| `APP_RES_DIR`          | Path to static resources                      | `./public/resources`                         |
| `MAPBOX_TOKEN`         | Mapbox API token (for maps)                   | `<your_mapbox_token>`                        |
| `PUBLIC_API_URL`       | Panahon API URL                               | `https://pahanon.observatory.ph/data/api/v1` |
| `DATABASE_URL`         | SQLite database file connection string        | `file:./panahon.db`                          |
| `BETTER_AUTH_SECRET`   | Secret key for Better Auth authentication     | `<your_better_auth_secret>`                  |
| `BETTER_AUTH_URL`      | Base URL for Better Auth backend              | `https://panahon.observatory.ph`             |
| `GOOGLE_CLIENT_ID`     | OAuth client ID for Google authentication     | `<your_google_client_id>`                    |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret for Google authentication | `<your_google_client_secret>`                |

> **Note:** Never commit `.env` files or secrets to version control.

## Additional Notes

- Project uses [Astro](https://astro.build) with [Vue](https://vuejs.org/) integration.
- See [Prisma documentation](https://www.prisma.io/docs/) for advanced database workflows.
- For authentication setup and configuration, refer to the [Better-Auth documentation](https://better-auth.com/docs).
- A valid [Mapbox](https://www.mapbox.com/) token is required for map-related features.

