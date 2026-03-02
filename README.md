# UNS Calendar Sync

Simple app that fetches the academic calendar from uns.edu.ar, allows selecting events and exporting them to Google Calendar.

Structure
- `/` — Frontend (Vite + React + TypeScript)
- `/api` — Proxy server that fetches the UNS calendar and returns HTML

Deployment (Raspberry Pi with external nginx)

This repo produces two containers: `api` and `frontend`. Since you already run `nginx` on the Raspberry Pi host, the repository includes an nginx configuration file in `nginx/default.conf` you can copy to the host. The host nginx should proxy `/api` to `http://127.0.0.1:3001` and serve the frontend assets (or reverse-proxy to the frontend container).

Quick start (on the Raspberry Pi)

1. Place your TLS certs (e.g. from Let's Encrypt) into a directory on the host (we assume `/etc/nginx/certs`) with `fullchain.pem` and `privkey.pem`.
2. Copy the nginx config from this repo into your host nginx sites directory and enable it. Example (adjust paths as you prefer):

```bash
sudo cp nginx/default.conf /etc/nginx/sites-available/calendario-uns
sudo ln -s /etc/nginx/sites-available/calendario-uns /etc/nginx/sites-enabled/
sudo mkdir -p /etc/nginx/certs
# copy your certs into /etc/nginx/certs
sudo nginx -t && sudo systemctl reload nginx
```

3. From repo root, build and start the two containers (no nginx container):

```bash
docker compose up --build -d
```

4. After `docker compose up --build -d` the `frontend` service will copy the built static files into the repository `./dist` folder (mounted into the container). Configure your host nginx to serve that folder as the site root (example: `/var/www/calendario-uns` → point it to the repo `dist`), and proxy `/api` to `http://127.0.0.1:3001`.

Example: make the repo `dist` available to nginx:

```bash
# from repo on the Pi
docker compose up --build -d
# copy or symlink the built files to the nginx webroot
sudo mkdir -p /var/www/calendario-uns
sudo rsync -a --delete ./dist/ /var/www/calendario-uns/
sudo systemctl reload nginx
```

5. Ensure DNS for `calendario-uns.chewer.net` points to your Raspberry Pi public IP.

Notes & best practices
- The provided `nginx/default.conf` is intended to be used on the host nginx. It expects the API to be available on `127.0.0.1:3001`.
- Frontend uses a relative `/api/calendar` path so the host nginx will proxy requests correctly.
- Keep TLS certificates outside the repo and use proper file permissions (600 for private keys).
- Use `docker-compose` with restart policies and consider adding `healthcheck`s to both services.
- Keep secrets out of the repo; use Docker secrets or environment files mounted at runtime if needed.

Security recommendations
- Use least-privilege: run containers with non-root users where possible.
- Use `ufw` or firewall rules to allow only necessary ports (80/443) and block others.
- Monitor and rotate TLS certs; automate with Certbot.
- Add rate-limiting on `nginx` if exposed publicly: `limit_req_zone` / `limit_req`.
- Configure logging and an automated backup for any stored data.

Files added/modified
- `Dockerfile` — multi-stage build for frontend
- `docker-compose.yml` — orchestrates `frontend` and `api` (nginx runs on host)
- `nginx/default.conf` — nginx reverse-proxy and security headers (for host nginx)
- `.dockerignore` — reduce build context

If you want, I can:
- Add automatic TLS provisioning using `traefik` or `certbot` automation.
- Harden `nginx` further with rate-limiting and stricter headers.
- Add `healthcheck`s for containers and a small `make` or script to ease deploys.
If you want, I can:
- Add automatic TLS provisioning using `traefik` or `certbot` automation.
- Harden `nginx` further with rate-limiting and stricter headers.
- Add `healthcheck`s for containers and a small `make` or script to ease deploys.
