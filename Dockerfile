## Multi-stage Dockerfile: build Vite app and produce static `dist`
FROM node:20-bullseye-slim AS builder

# Allow the host to supply a UID/GID so built artifacts can be owned by your user
ARG BUILD_UID=1000
ARG BUILD_GID=1000

WORKDIR /app
# Ensure devDependencies (vite) are installed for the build step
# Do NOT set NODE_ENV=production here because that would omit devDependencies

# Copy package file only and install dependencies for the target architecture
# Do NOT copy package-lock.json so optional native deps are resolved for the build arch
COPY package.json ./
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
RUN npm install --prefer-offline --no-audit --no-fund

# Create host-matching user/group and copy sources owned by that UID:GID
RUN groupadd -g ${BUILD_GID} builder || true \
 && useradd -m -u ${BUILD_UID} -g ${BUILD_GID} builder || true
COPY --chown=${BUILD_UID}:${BUILD_GID} . .

# Ensure the build user owns all files (including node_modules created earlier)
RUN chown -R ${BUILD_UID}:${BUILD_GID} /app || true

# Run the build as the non-root user (by numeric UID:GID)
USER ${BUILD_UID}:${BUILD_GID}
RUN npm run build

## Export stage: expose built artifacts and provide a simple copy entrypoint
FROM node:20-bullseye-slim AS exporter
WORKDIR /out
COPY --from=builder /app/dist ./dist
# Ensure static files from `public/` are also available in the exported `dist`
COPY --from=builder /app/public/. ./dist/

# When this container runs with a host bind mount at /dist, the CMD will copy
# the built files into the mounted folder so the host (nginx) can serve them.
CMD ["sh", "-c", "cp -r /out/dist/. /dist/ || true && echo 'Build copied to /dist' && sleep 3600"]
