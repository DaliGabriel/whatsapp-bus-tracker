# Use official Node.js LTS image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json before installing dependencies (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Ensure Prisma is installed
RUN npx prisma generate

# Run database migration in production
RUN npx prisma migrate deploy

# Ensure TypeScript is installed globally (optional if installed locally)
RUN npm install -g typescript

# Compile TypeScript to JavaScript
RUN npm run build

# Set environment variables
ENV NODE_ENV=production

# Expose port (not necessary for Baileys, but useful if adding a web server later)
EXPOSE 3000

# Start the bot using compiled JavaScript
CMD ["node", "dist/index.js"]