# Career Saathi (Minor Project)

A simple full-stack career guidance app.

## What it does

- Student signup and login
- RIASEC quiz
- AI-based career recommendations
- Career chat and saved reports

## Tech stack

- Frontend: React + Vite
- Backend: Node.js + Express + MongoDB
- AI: Google Gemini (via LangChain)

## Project structure

- `client/` -> frontend app
- `server/` -> backend API

## Prerequisites

- Node.js 18+
- MongoDB connection string
- Google API key (Gemini)

## Environment variables

Create `server/.env` with:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
GOOGLE_API_KEY=your_google_api_key
```

Optional frontend env in `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

If `VITE_API_BASE_URL` is not set, frontend uses same-origin/proxy behavior.

## Install

```bash
cd client
npm install

cd ../server
npm install
```

## Run

Start backend:

```bash
cd server
npm run dev
```

Start frontend (new terminal):

```bash
cd client
npm run dev
```

## Build frontend

```bash
cd client
npm run build
```

## Notes

- Always run commands from the correct folder (`client` or `server`).
- Backend runs on `http://localhost:8000` by default.
