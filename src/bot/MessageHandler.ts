import { WASocket } from "@whiskeysockets/baileys";
import { CommandProcessor } from "./CommandProcessor";
import { LocationHandler } from "./LocationHandler";

export class MessageHandler {
  private sock: WASocket;
  private commandProcessor: CommandProcessor;
  private locationHandler: LocationHandler;

  constructor(sock: WASocket) {
    this.sock = sock;
    this.commandProcessor = new CommandProcessor(sock);
    this.locationHandler = new LocationHandler(sock);
    this.setupListeners();
  }

  private setupListeners() {
    this.sock.ev.on("messages.upsert", async ({ messages }) => {
      const msg = messages[0];
      if (!msg.key.fromMe && msg.message && msg.key.remoteJid) {
        const chatId = msg.key.remoteJid;
        const text = msg.message.conversation?.toLowerCase().trim();

        if (text) {
          this.commandProcessor.processCommand(chatId, text);
        }

        if (msg.message.locationMessage) {
          this.locationHandler.handleLocationUpdate(
            chatId,
            msg.message.locationMessage
          );
        }
      }
    });
  }
}
