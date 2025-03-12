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
