# --- Stage 1: Build ---
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your source code
COPY . .

# Build the TypeScript code (this will compile to the "dist" folder as configured in your tsconfig)
RUN npm run build

# --- Stage 2: Production ---
FROM node:20

# Set working directory
WORKDIR /app

#ensure the auth folder persists across restarts
VOLUME /app/auth_info_baileys

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install

# Copy built application code and any other needed assets (like your Prisma schema)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Generate the Prisma client (if your app uses it at runtime)
RUN npx prisma generate

# Expose any ports if your app listens on one (for example, if you later add an HTTP server)
# EXPOSE 3000

# Set environment variables if needed (or provide via your VPS configuration)
# ENV DATABASE_URL="postgresql://user:password@host:port/dbname"

# Run the application
CMD ["node", "dist/index.js"]