## Multi-stage Dockerfile: build Vite app and produce static `dist`
FROM node:20-alpine AS builder
WORKDIR /app
# Ensure devDependencies (vite) are installed for the build step
# Do NOT set NODE_ENV=production here because that would omit devDependencies

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy sources and build
COPY . .
RUN npm run build

## Export stage: expose built artifacts and provide a simple copy entrypoint
FROM node:20-alpine AS exporter
WORKDIR /out
COPY --from=builder /app/dist ./dist

# When this container runs with a host bind mount at /dist, the CMD will copy
# the built files into the mounted folder so the host (nginx) can serve them.
CMD ["sh", "-c", "cp -r /out/dist/. /dist/ || true && echo 'Build copied to /dist' && sleep 3600"]
