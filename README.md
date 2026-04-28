# where_is_my_daughter_server

This is a Internet of Things project at University of North Florida - Master's program developing an android app with BLE, wifi and GPS features

# Where's My Daughter — IoT Live Tracking System

This project is developed under the class Internet Of Things at University of North Florida, at Master's program, under supervision of Dr. Zormita Prodanoff.

A modern, real-time tracking dashboard built with Laravel, React, and Leaflet. The system provides live visualization of device locations with a focus on premium UI/UX, theme flexibility, and robust data handling.

## Features

- **Live Dashboard**: Real-time localization feed with auto-refresh (5s to 60s intervals).
- **Interactive Map**: Modal-based map view using **React-Leaflet v5**.
- **Premium Visualization**: Custom SVG pulsing markers and theme-aware map tiles (CartoDB).
- **Theme Support**: Persistent Light and Dark modes.
- **Advanced Table**: Backend-driven pagination, customizable items per page, sorted by newest.
- **API Key Authentication**: All data ingestion endpoints protected via `x-api-key` header.
- **Infrastructure as Code**: Terraform configurations for DigitalOcean.
- **CI/CD**: Automated deploy pipeline via GitHub Actions.

## Tech Stack

- **Backend**: Laravel 12 (PHP 8.4)
- **Frontend**: React 18, Inertia.js, Tailwind CSS
- **Maps**: Leaflet & React-Leaflet
- **Database**: SQLite
- **Containerization**: Docker Compose (PHP-FPM + Nginx)
- **Infrastructure**: Terraform + DigitalOcean
- **CI/CD**: GitHub Actions

## Local Development

### Prerequisites

- Docker & Docker Compose
- Node.js (for local asset editing)

### Getting Started

1. **Clone the repository**:

    ```bash
    git clone https://github.com/domjesus/where_is_my_daughter_server
    cd where_is_my_daughter_server
    ```

2. **Environment setup**:

    ```bash
    cp .env.example .env
    ```

3. **Launch with Docker**:

    ```bash
    make up
    make install
    make fresh
    ```

4. **Access the app**:
    - Dashboard: [http://localhost:8080](http://localhost:8080)
    - Vite Dev Server: [http://localhost:5173](http://localhost:5173)

### Available Commands

| Command          | Description                              |
| :--------------- | :--------------------------------------- |
| `make up`        | Start all services in detached mode      |
| `make down`      | Stop all services                        |
| `make build`     | Build production frontend assets         |
| `make dev`       | Start Vite development server            |
| `make fresh`     | Reset database, migrate, and seed        |
| `make mock-data` | Send a mock localization record via curl |
| `make shell`     | Open a shell in the app container        |

## Production

The application is deployed at [https://wheresmydaughter.me](https://wheresmydaughter.me) on a DigitalOcean droplet.

### Stack

- **Nginx** (Alpine) — serves static assets and proxies PHP requests
- **PHP-FPM** (8.4 Alpine) — runs the Laravel application
- **SQLite** — database file persisted on the host at `database/database.sqlite`
- **Let's Encrypt** — TLS certificate via Certbot, auto-renewed via systemd timer

### Docker in Production

The production setup uses `compose.production.yaml`, which differs from local:

- No Node dev server
- Host volumes for `.env`, `database/`, and `public/build/` to persist data and assets across deploys

```bash
# Start
docker compose -f compose.production.yaml up -d

# View logs
docker compose -f compose.production.yaml logs -f

# Run artisan commands
docker compose -f compose.production.yaml exec app php artisan <command>
```

### SSH Access

```bash
ssh user@ip-server
```

### Viewing Logs on the Server

```bash
# Container logs
docker compose -f compose.production.yaml logs -f

# Laravel logs
docker compose -f compose.production.yaml exec app tail -f storage/logs/laravel.log
```

## CI/CD — GitHub Actions

Two workflows run on push to `main`:

### `terraform.yml` — Infrastructure

Triggers only when `terraform/**` files change.

- Runs `terraform plan` on PRs
- Runs `terraform apply` on merge to `main`

**Required secrets:** `DIGITALOCEAN_TOKEN`, `DROPLET_SSH_PUBLIC_KEY`

### `deploy.yml` — Application Deploy

Triggers on every push to `main` (except terraform changes).

Steps:

1. SSH into the droplet
2. `git reset --hard origin/main`
3. Write `.env` from the `APP_ENV_PRODUCTION_B64` secret (base64-encoded)
4. Build frontend assets via Node Docker container
5. Rebuild and restart the PHP-FPM container
6. Run `php artisan migrate --force`
7. Cache config, routes, and views

**Required secrets:**

| Secret                    | Purpose                                   |
| :------------------------ | :---------------------------------------- |
| `DIGITALOCEAN_TOKEN`      | Terraform DigitalOcean provider           |
| `DROPLET_SSH_PUBLIC_KEY`  | SSH key registered on the droplet         |
| `DROPLET_SSH_PRIVATE_KEY` | SSH key used by the deploy workflow       |
| `DROPLET_HOST`            | Droplet IP address                        |
| `APP_ENV_PRODUCTION_B64`  | Base64-encoded `.env` file for production |

## Infrastructure (Terraform)

The `terraform/` directory manages the DigitalOcean infrastructure:

- `main.tf` — droplet and project resource definitions
- `variables.tf` — input variables
- `outputs.tf` — droplet IPs and URNs

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## API

### POST `/localizations/data`

Ingest a location record from an IoT device.

**Headers:**

```
x-api-key: <your-api-key>
Content-Type: application/json
```

**Body:**

```json
{
    "latitude": "-23.550520",
    "longitude": "-46.633308",
    "source": "wifi",
    "is_home": true
}
```
