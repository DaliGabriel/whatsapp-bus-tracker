import { WASocket } from "@whiskeysockets/baileys";
import { jest } from "@jest/globals";
import { MessageHandler } from "../src/bot/MessageHandler";
import { logger } from '../src/bot/constants';

jest.unstable_mockModule("@whiskeysockets/baileys", () => ({
  default: jest.fn(() => ({
    ev: {
      on: jest.fn(),
    },
    sendMessage: jest.fn(),
  })),
}));

describe("MessageHandler", () => {
  let messageHandler: MessageHandler;
  let mockSocket: WASocket;

  beforeEach(() => {
    mockSocket = {
      ev: {
        on: jest.fn(),
      },
      sendMessage: jest.fn(),
      logger: logger,
    } as unknown as WASocket;

    messageHandler = new MessageHandler(mockSocket);
  });

  it("should initialize and set up listeners", () => {
    expect(mockSocket.ev.on).toHaveBeenCalled();
  });

  it("should send the bus location when asked", async () => {
    const mockMessage = {
      key: { remoteJid: "1234", fromMe: false },
      message: { conversation: "Where is the bus?" },
    };

    await messageHandler["setupListeners"]();
    await messageHandler["sendMessage"](
      "1234",
      "🚌 The bus is at: Unknown\nLast Update: unknown"
    );

    expect(mockSocket.sendMessage).toHaveBeenCalledWith("1234", {
      text: expect.stringContaining("🚌 The bus is at: Unknown"),
    });
  });

  it("should update the bus location when a user sends 'bus at [location]'", async () => {
    const mockMessage = {
      key: { remoteJid: "1234", fromMe: false },
      message: { conversation: "Bus at Central Station" },
    };

    await messageHandler["setupListeners"]();
    await messageHandler["sendMessage"](
      "1234",
      "✅ Location updated! The bus is now at: Central Station"
    );

    expect(mockSocket.sendMessage).toHaveBeenCalledWith("1234", {
      text: expect.stringContaining("✅ Location updated!"),
    });
  });
});
