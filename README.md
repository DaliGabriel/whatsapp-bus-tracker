# 🚌 WhatsApp Bus Tracker Bot  

A **WhatsApp bot** built with **Node.js** and **Baileys** that allows users to track and update bus locations in real-time—without needing a dedicated app or GPS integration.  

## ✨ Features
✅ **Get real-time location** – Users can ask *"Where is the bus?"* and get the latest update.  
✅ **Update the location** – Anyone can send *"Bus at [location]"* to update the location.  
✅ **Easy setup** – Runs with a simple Node.js script using WhatsApp Web authentication.  

## 🚀 How It Works
1. Users send `Where is the bus?` → Bot responds with the last known location.  
2. Users send `Bus at [location]` → Bot updates the location and confirms.  
3. Stores location updates temporarily (future improvement: database storage).  

## 🛠 Tech Stack
- **Node.js**
- **Baileys (WhatsApp Web API)**
- **Pino (Logging)**  

## 📦 Installation
1. Clone this repository:
   ```sh
   git clone https://github.com/DaliGabriel/whatsapp-bus-tracker.git
   cd whatsapp-bus-tracker