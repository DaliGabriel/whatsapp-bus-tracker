import { jest } from "@jest/globals";
import { BotService } from "../src/bot/BotService";

// Mock Baileys functions
jest.unstable_mockModule("@whiskeysockets/baileys", () => ({
  fetchLatestBaileysVersion: jest.fn(() =>
    Promise.resolve({ version: [2, 0, 0] })
  ),
  useMultiFileAuthState: jest.fn(() =>
    Promise.resolve({ state: {}, saveCreds: jest.fn() })
  ),
  default: jest.fn(() => ({
    ev: {
      on: jest.fn(),
    },
  })),
}));

describe("BotService", () => {
  let botService: BotService;

  beforeEach(async () => {
    botService = new BotService();
    await botService.initialize();
  });

  it("should initialize the bot and return a socket instance", async () => {
    const socket = botService.getSocket();
    expect(socket).not.toBeNull();
  });
});
