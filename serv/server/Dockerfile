FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN npx prisma generate

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
