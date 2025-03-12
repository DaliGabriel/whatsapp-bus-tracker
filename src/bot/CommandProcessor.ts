import { WASocket } from "@whiskeysockets/baileys";
import { db } from "./db";

export class CommandProcessor {
  private sock: WASocket;

  constructor(sock: WASocket) {
    this.sock = sock;
  }

  async processCommand(chatId: string, text: string) {
    switch (text) {
      case "menu":
        await this.sendMenu(chatId);
        break;
      case "1":
        const lastLocation = await db.getLastBusLocation();
        await this.sendMessage(
          chatId,
          `📍 View on map 🚌: https://www.google.com/maps?q=${lastLocation?.location}`
        );
        break;
      case "2":
        await db.subscribeUser(chatId);
        await this.sendMessage(
          chatId,
          "✅ You are now subscribed to bus alerts!"
        );
        break;
      case "3":
        await this.sendMessage(
          chatId,
          "📞 Need help? Contact us at +52 123-456-7890."
        );
        break;
      default:
        await this.sendMessage(
          chatId,
          "⚠️ Unknown command. Send *menu* to see available options."
        );
    }
  }

  private async sendMenu(chatId: string) {
    const menuMessage = `🌍 *Bus Tracker Bot Menu* 🌍
  1️⃣ Check Bus Location  
  2️⃣ Subscribe to Bus Alerts  
  3️⃣ Get Support  
  📍 To update the bus location, share your live location!`;
    await this.sendMessage(chatId, menuMessage);
  }

  private async sendMessage(chatId: string, text: string) {
    await this.sock.sendMessage(chatId, { text });
  }
}
