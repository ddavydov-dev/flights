# ---------- Build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json tsconfig.json ./
RUN npm ci

# Copy source and compile TypeScript ➜ JS
COPY src ./src
RUN npm run build

# ---------- Production stage ----------
FROM node:20-alpine
WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output
COPY --from=builder /app/dist ./dist

EXPOSE 4000
ENV NODE_ENV production
CMD ["node", "dist/server.js"]