import { WASocket } from "@whiskeysockets/baileys";
import { db } from "./db";

export class MessageHandler {
  private sock: WASocket;

  constructor(sock: WASocket) {
    this.sock = sock;
    this.setupListeners();
  }

  private setupListeners() {
    this.sock.ev.on("messages.upsert", async ({ messages }) => {
      const msg = messages[0];
      if (!msg.key.fromMe && msg.message && msg.key.remoteJid) {
        const chatId = msg.key.remoteJid;
        const text = msg.message.conversation;

        if (text && chatId) {
          await db.saveMessage(chatId, text);
        }

        if (text?.toLowerCase() === "where is the bus?") {
          const lastLocation = await db.getLastBusLocation();
          await this.sendMessage(
            chatId,
            `🚌 The bus is at: ${lastLocation?.location || "Unknown"}`
          );
        }

        if (text?.toLowerCase().startsWith("bus at ")) {
          const location = text.replace("bus at ", "");
          await db.updateBusLocation(location);
          await this.sendMessage(
            chatId,
            `✅ Location updated! The bus is now at: ${location}`
          );
        }
      }
    });
  }

  private async sendMessage(chatId: string, text: string) {
    await this.sock.sendMessage(chatId, { text });
  }
}
