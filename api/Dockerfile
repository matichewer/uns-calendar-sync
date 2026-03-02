# Usa imagen oficial de Node con soporte ARM64 (Raspberry Pi 4/5)
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY server.js ./

EXPOSE 3002

USER node

CMD ["node", "server.js"]
