import { MessageHandler } from "../src/bot/MessageHandler"; // Adjust path as needed
import { WASocket } from "@whiskeysockets/baileys";

describe("MessageHandler", () => {
  let mockSocket: any;
  let messageHandler: MessageHandler;
  let mockCommandProcessor: any;
  let mockLocationHandler: any;
  let mockEv: any;

  beforeEach(() => {
    mockEv = {
      on: jest.fn(),
    };
    mockSocket = {
      ev: mockEv,
      sendMessage: jest.fn(),
    };

    // Create manual mocks for CommandProcessor and LocationHandler
    mockCommandProcessor = {
      processCommand: jest.fn(),
    };
    mockLocationHandler = {
      handleLocationUpdate: jest.fn(),
    };

    messageHandler = new MessageHandler(mockSocket as WASocket);

    // Override the instances created within MessageHandler with our mocks
    messageHandler["commandProcessor"] = mockCommandProcessor; // access the private property
    messageHandler["locationHandler"] = mockLocationHandler; // access the private property
  });

  it("should set up the messages.upsert event listener", () => {
    expect(mockEv.on).toHaveBeenCalledWith(
      "messages.upsert",
      expect.any(Function)
    );
  });

  it("should call commandProcessor.processCommand when a text message is received", async () => {
    const messagesUpsertHandler = mockEv.on.mock.calls.find(
      (call: any) => call[0] === "messages.upsert"
    )[1];

    await messagesUpsertHandler({
      messages: [
        {
          key: { remoteJid: "123@s.whatsapp.net", fromMe: false },
          message: { conversation: "test message" },
        },
      ],
    });

    expect(mockCommandProcessor.processCommand).toHaveBeenCalledWith(
      "123@s.whatsapp.net",
      "test message"
    );
  });

  it("should call locationHandler.handleLocationUpdate when a location message is received", async () => {
    const messagesUpsertHandler = mockEv.on.mock.calls.find(
      (call: any) => call[0] === "messages.upsert"
    )[1];

    const locationMessage = { degreesLatitude: 10, degreesLongitude: 20 };

    await messagesUpsertHandler({
      messages: [
        {
          key: { remoteJid: "123@s.whatsapp.net", fromMe: false },
          message: { locationMessage: locationMessage },
        },
      ],
    });

    expect(mockLocationHandler.handleLocationUpdate).toHaveBeenCalledWith(
      "123@s.whatsapp.net",
      locationMessage
    );
  });

  it("should not call commandProcessor or locationHandler for messages from self", async () => {
    const messagesUpsertHandler = mockEv.on.mock.calls.find(
      (call: any) => call[0] === "messages.upsert"
    )[1];

    await messagesUpsertHandler({
      messages: [
        {
          key: { remoteJid: "123@s.whatsapp.net", fromMe: true },
          message: { conversation: "test message" },
        },
      ],
    });

    expect(mockCommandProcessor.processCommand).not.toHaveBeenCalled();
    expect(mockLocationHandler.handleLocationUpdate).not.toHaveBeenCalled();
  });
});
