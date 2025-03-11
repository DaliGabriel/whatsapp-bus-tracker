import { BotService } from "./bot/BotService";
import { MessageHandler } from "./bot/MessageHandler";

async function startBot() {
  const botService = new BotService();
  const sock = await botService.initialize();

  if (sock) {
    new MessageHandler(sock);
  }
}

startBot();
