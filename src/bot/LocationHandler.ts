import { WASocket } from "@whiskeysockets/baileys";
import { db } from "./db";

export class LocationHandler {
  private sock: WASocket;

  constructor(sock: WASocket) {
    this.sock = sock;
  }

  async handleLocationUpdate(chatId: string, locationMessage: any) {
    const { degreesLatitude, degreesLongitude } = locationMessage;
    const location = `${degreesLatitude},${degreesLongitude}`;

    await db.updateBusLocation(location);
    await this.sendMessage(
      chatId,
      `✅ Bus location updated! 📍: https://www.google.com/maps?q=${location}`
    );

    await this.sendBusUpdateToSubscribers(location, chatId);
  }

  private async sendBusUpdateToSubscribers(
    location: string,
    senderChatId: string
  ) {
    const subscribers = (await db.getSubscribedUsers()) || [];
    for (const subscriber of subscribers) {
      if (senderChatId !== subscriber.chatId) {
        await this.sendMessage(
          subscriber.chatId,
          `🚨 Bus Update! 🚌: https://www.google.com/maps?q=${location}`
        );
      }
    }
  }

  private async sendMessage(chatId: string, text: string) {
    await this.sock.sendMessage(chatId, { text });
  }
}
