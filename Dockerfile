## Multi-stage Dockerfile: build Vite app and produce static `dist`
FROM node:20-bullseye-slim AS builder

# Allow the host to supply a UID/GID so built artifacts can be owned by your user
ARG BUILD_UID=1000
ARG BUILD_GID=1000

RUN groupadd -g ${BUILD_GID} builder || true \
 && useradd -m -u ${BUILD_UID} -g ${BUILD_GID} builder || true

WORKDIR /app
# Ensure devDependencies (vite) are installed for the build step
# Do NOT set NODE_ENV=production here because that would omit devDependencies

# Copy package files and install as root first, then switch to the non-root user
COPY package.json package-lock.json* ./
# Use numeric UID:GID for chown to avoid user name resolution issues during build
RUN chown -R ${BUILD_UID}:${BUILD_GID} /app || true

USER builder
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
RUN npm ci --prefer-offline --no-audit --no-fund

# Copy sources as the non-root builder user and build
COPY --chown=builder:builder . .
RUN npm run build

## Export stage: expose built artifacts and provide a simple copy entrypoint
FROM node:20-bullseye-slim AS exporter
WORKDIR /out
COPY --from=builder /app/dist ./dist

# When this container runs with a host bind mount at /dist, the CMD will copy
# the built files into the mounted folder so the host (nginx) can serve them.
CMD ["sh", "-c", "cp -r /out/dist/. /dist/ || true && echo 'Build copied to /dist' && sleep 3600"]
