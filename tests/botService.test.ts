import { BotService } from "../src/bot/BotService"; // Adjust path as needed
import makeWASocket, {
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import * as qrcode from "qrcode-terminal";
import { logger } from "../src/bot/constants";

jest.mock("@whiskeysockets/baileys");
jest.mock("qrcode-terminal");
jest.mock("../src/bot/constants", () => ({
  logger: {
    debug: jest.fn(),
    error: jest.fn(),
  },
}));

describe("BotService", () => {
  let botService: BotService;
  let mockSocket: any;
  let mockEv: any;

  beforeEach(async () => {
    mockEv = {
      on: jest.fn(),
    };
    mockSocket = {
      ev: mockEv,
    };

    (makeWASocket as jest.Mock).mockReturnValue(mockSocket);
    (fetchLatestBaileysVersion as jest.Mock).mockResolvedValue({
      version: [2, 2323, 4],
    });
    (useMultiFileAuthState as jest.Mock).mockResolvedValue({
      state: {},
      saveCreds: jest.fn(),
    });

    botService = new BotService();
    await botService.initialize();
  });

  it("should initialize the socket with correct parameters", async () => {
    expect(makeWASocket).toHaveBeenCalledWith({
      version: [2, 2323, 4],
      auth: {},
      printQRInTerminal: true,
      logger: logger,
      browser: ["WhatsApp Bot", "Chrome", "1.0"],
    });
  });

  it("should set up event listeners", () => {
    expect(mockEv.on).toHaveBeenCalledWith(
      "creds.update",
      expect.any(Function)
    );
    expect(mockEv.on).toHaveBeenCalledWith(
      "connection.update",
      expect.any(Function)
    );
  });

  it("should generate QR code when connection update has qr", () => {
    const connectionUpdateHandler = mockEv.on.mock.calls.find(
      (call: any) => call[0] === "connection.update"
    )[1];

    connectionUpdateHandler({ qr: "test-qr" });

    expect(qrcode.generate).toHaveBeenCalledWith("test-qr", { small: true });
  });

  it("should log connected when connection is open", () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    const connectionUpdateHandler = mockEv.on.mock.calls.find(
      (call: any) => call[0] === "connection.update"
    )[1];

    connectionUpdateHandler({ connection: "open" });
    expect(consoleLogSpy).toHaveBeenCalledWith("✅ Bot is connected!");
    consoleLogSpy.mockRestore();
  });

  it("should reconnect when connection is closed and shouldReconnect is true", async () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    const connectionUpdateHandler = mockEv.on.mock.calls.find(
      (call: any) => call[0] === "connection.update"
    )[1];

    connectionUpdateHandler({
      connection: "close",
      lastDisconnect: { error: true },
    });
    expect(consoleLogSpy).toHaveBeenCalledWith("🔄 Reconnecting...");
    consoleLogSpy.mockRestore();
  });

  it("should log session expired when connection is closed and shouldReconnect is false", () => {
    const consoleErrorSpy = jest.spyOn(console, "error");
    const connectionUpdateHandler = mockEv.on.mock.calls.find(
      (call: any) => call[0] === "connection.update"
    )[1];

    connectionUpdateHandler({
      connection: "close",
      lastDisconnect: { error: false },
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "🚨 SESSION EXPIRED: You need to scan the QR code again."
    );
    consoleErrorSpy.mockRestore();
  });
});
