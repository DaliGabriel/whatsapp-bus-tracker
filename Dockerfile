# Use official Node.js LTS image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app files
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Expose port (not necessary for Baileys, but useful if adding a web server later)
EXPOSE 3000

# Run the bot
CMD ["node", "busBot.js"]