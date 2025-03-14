# 🚌 WhatsApp Bus Tracker Bot

A **WhatsApp bot** that allows users to check and update a **bus location**, subscribe to real-time location updates, and receive alerts via WhatsApp messages. Built using **Node.js, TypeScript, Prisma, and Baileys** with clean architecture and **SOLID principles**.

## 🚀 Features

✅ **Check real-time bus location** via WhatsApp  
✅ **Update bus location** by sending a live location  
✅ **Subscribe to bus location alerts** and get updates when the bus moves  
✅ **Command-based system** with a simple menu  

## 🛠️ Technologies Used

- **Node.js** - Backend runtime
- **TypeScript** - Type safety and maintainability
- **Baileys** (`@whiskeysockets/baileys`) - WhatsApp Web API
- **Prisma** - ORM for database operations
- **PostgreSQL** - Database for storing locations and subscribers
- **Docker** (Planned) - Containerized deployment
- **SOLID Principles & Clean Code** - To ensure modularity and maintainability

---

## 📦 Project Structure

```plaintext
📦 whatsapp-bus-tracker
 ┣ 📂 bot/
 ┃ ┣ 📜 BotService.ts   # Initializes the bot and handles connection
 ┃ ┣ 📜 MessageHandler.ts # Handles incoming WhatsApp messages
 ┃ ┣ 📜 CommandProcessor.ts # Processes user commands
 ┃ ┣ 📜 LocationHandler.ts # Manages location updates & subscriptions
 ┣ 📂 db/
 ┃ ┣ 📜 index.ts # Prisma database operations
 ┣ 📜 Dockerfile (Planned)
 ┣ 📜 .env.example # Environment variables (example)
 ┣ 📜 README.md # Documentation
 ┣ 📜 package.json
 ┣ 📜 tsconfig.json
 ┗ 📜 index.ts # Entry point
 ```

 ## 🐳 Docker Instructions

1.  **Build the Docker Image:**

    Navigate to the project's root directory (where the `Dockerfile` is located) and run the following command to build the Docker image:

    ```bash
    docker build -t whatsapp-bus-tracker .
    ```

    This command will build a Docker image named `whatsapp-bus-tracker` using the instructions in your `Dockerfile`.

2.  **Run the Docker Container:**

    To run the Docker container, use the following command. **Important:** You'll need to provide the necessary environment variables, particularly the `DATABASE_URL` for your PostgreSQL database.

    ```bash
    docker run -d --name whatsapp-bot \
        -e DATABASE_URL="postgresql://user:password@host:port/dbname" \
        -v whatsapp-bot-data:/app/auth_info_baileys \
        --restart unless-stopped \
        whatsapp-bus-tracker
    ```

3.  **Environment Variables:**

    Ensure you replace the placeholder values in the `DATABASE_URL` with your actual database credentials. You may need to add other environment variables as required by your application.

4. **Checking logs:**

    To check the docker logs, use the following command:

    ```bash
    docker logs whatsapp-bot
    ```
