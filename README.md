# UNS Calendar Sync

A small web application to sync the academic calendar from the Universidad Nacional del Sur (UNS) and export selected events as an iCalendar (ICS) file.

## Features

- Fetches events from the UNS calendar source.
- Lets users select the events they want to include.
- Generates and downloads an `.ics` file that can be imported into calendar apps (Google Calendar, Outlook, Apple Calendar, etc.).

## What is an ICS file?

ICS (iCalendar) is a standard format for exchanging calendar and event data. An `.ics` file contains event details like title, start/end time, description and location. Most calendar apps support importing `.ics` files or subscribing to calendar feeds.

Benefits:
- Portability across calendar providers.
- Ability to keep a local copy of selected events.

## Example: Importing into Google Calendar

1. Open Google Calendar in your browser.
2. On the left side, click the `+` next to "Other calendars" and choose "Import".
3. Upload the `.ics` file you downloaded and select the target calendar.
4. Confirm to add the events.

## Project structure

- `/` (root): Frontend application built with Vite + React + TypeScript.
- `/src`: UI source code.
  - `main.tsx`, `App.tsx`: app entry and layout.
  - `components/`: UI components (filters, event rows, calendar, shared UI primitives).
  - `utils/`: helpers including `generateICS.ts` and `parseCalendar.ts` for creating ICS files and parsing the source calendar.
- `/api`: Node-based proxy server that fetches the UNS calendar and provides data to the frontend.
- `/public`: static assets.
- `/nginx`: example Nginx configuration for serving a production build (optional).

## Local development

Prerequisites:

- Node.js (v18+ recommended) and npm.
- Docker & Docker Compose (optional, see Docker section).

Install dependencies and run the frontend + API in development mode (recommended for active development):

```bash
git clone https://github.com/matichewer/uns-calendar-sync.git
cd uns-calendar-sync
npm install
# Start the frontend dev server (Vite)
npm run dev
```

In a separate terminal, start the API

```bash
cd api
npm install
npm start
```

The frontend dev server uses Vite and typically runs on `http://localhost:5173`. The local API (when run from `/api`) listens on its configured port and the frontend will use the proxy during development.

## Local development with Docker

This repository includes a `docker-compose.yml` that can build and run the API and frontend build pipeline. The `api` service is published to the host at port `3002` (maps to the container port `3001`). The frontend build stage outputs the static `dist` folder to the host via a bind mount.

To build and run everything with Docker Compose (from the project root):

```bash
# Build containers and start services
docker compose up --build

# Stop and remove containers
docker compose down
```

Notes:

- After `docker compose up --build` completes, the API will be reachable at `http://localhost:3002`.
- The frontend build artifacts will be placed into the repository `./dist` folder (the `frontend` service copies the built files into the host `./dist` volume). You can serve `./dist` with any static server (for example, use `npm run preview` locally or configure an Nginx container).
- To run only a specific service, add the service name: `docker compose up --build api`.

## Build for production

```bash
npm run build
# Serve the built files (example):
npm run preview
```

## Contributing

- Open an issue describing the change you propose.
- Fork the repository and submit a pull request.

