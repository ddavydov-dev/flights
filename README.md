# ✈️ Flights App

A full-stack flight booking application built with a modern microservice architecture. It includes:

- **Frontend**: Next.js (React) app
- **Backend**: Node.js (Express) API proxying Amadeus APIs
- **Containerization**: Docker Compose setup
- **Reverse Proxy**: NGINX

## 🔧 Local Development

You can run the entire stack with Docker, or work on each service individually using `npm run dev`.

### Docker-based full stack

#### Prerequisites

- Docker + Docker Compose
- Node.js (v20 recommended) and npm (optional, if building without Docker)

#### 1. Create required environment files

./code/backend/.env
AMADEUS_CLIENT_ID=your_id
AMADEUS_CLIENT_SECRET=your_secret
PORT=400

./code/frontend/.env
NEXT_PUBLIC_BACKEND_URL=http://localhost/api

#### 2. Update docker-compose.yml

Ensure the services include the .env reference:

services:
backend:
...
env_file: - ./code/backend/.env

#### 3. Run the app

`docker compose up -d --build`

Frontend available at: http://localhost
Backend proxied via: http://localhost/api

#### 4. Stop the app

`docker compose down`

### Run services individually (development mode)

For live reloading, debugging, or working on services separately:

#### Backend

cd code/backend
npm install
npm run dev
Runs on http://localhost:4000

Requires .env file

#### Frontend

cd code/frontend
npm install
npm run dev
Runs on http://localhost:3000

Make sure NEXT_PUBLIC_BACKEND_URL is set in .env (e.g. http://localhost:4000)
