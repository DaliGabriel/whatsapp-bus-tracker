import { CommandProcessor } from "../src/bot/CommandProcessor"; // Adjust path as needed
import { WASocket } from "@whiskeysockets/baileys";
import { db } from "../src/bot/db";

jest.mock("../src/bot/db");

describe("CommandProcessor", () => {
  let mockSocket: any;
  let commandProcessor: CommandProcessor;
  let mockSendMessage: jest.Mock;

  beforeEach(() => {
    mockSendMessage = jest.fn();
    mockSocket = {
      sendMessage: mockSendMessage,
    };

    commandProcessor = new CommandProcessor(mockSocket as WASocket);
  });

  it("should send the menu message when the command is 'menu'", async () => {
    await commandProcessor.processCommand("123@s.whatsapp.net", "menu");

    expect(mockSendMessage).toHaveBeenCalledWith(
      "123@s.whatsapp.net",
      expect.objectContaining({
        text: `🌍 *Bus Tracker Bot Menu* 🌍
  1️⃣ Check Bus Location  
  2️⃣ Subscribe to Bus Alerts  
  3️⃣ Get Support  
  📍 To update the bus location, share your live location!`,
      })
    );
  });

  it("should get the last location and send a message when the command is '1'", async () => {
    (db.getLastBusLocation as jest.Mock).mockResolvedValue({
      location: "12.345,67.890",
    });

    await commandProcessor.processCommand("123@s.whatsapp.net", "1");

    expect(mockSendMessage).toHaveBeenCalledWith(
      "123@s.whatsapp.net",
      expect.objectContaining({
        text: `📍 View on map 🚌: https://www.google.com/maps?q=12.345,67.890`,
      })
    );
  });

  //Problem on this test ****
  it("should subscribe the user and send a success message when the command is '2' and user is not subscribed", async () => {
    (db.isUserSubscribed as jest.Mock).mockResolvedValue(false);
    (db.subscribeUser as jest.Mock).mockResolvedValue(undefined);

    await commandProcessor.processCommand("123@s.whatsapp.net", "2");

    expect(db.subscribeUser).toHaveBeenCalledWith("123@s.whatsapp.net");

    expect(mockSendMessage).toHaveBeenCalledWith(
      "123@s.whatsapp.net",
      expect.objectContaining({
        text: "✅ You are now subscribed to bus alerts!",
      })
    );
  });

  it("should send a 'already subscribed' message when the command is '2' and user is already subscribed", async () => {
    (db.isUserSubscribed as jest.Mock).mockResolvedValue(true);

    await commandProcessor.processCommand("123@s.whatsapp.net", "2");

    expect(mockSendMessage).toHaveBeenCalledWith(
      "123@s.whatsapp.net",
      expect.objectContaining({
        text: `⚠️ You are already subscribed to bus alerts!`,
      })
    );
  });

  it("should send a support message when the command is '3'", async () => {
    await commandProcessor.processCommand("123@s.whatsapp.net", "3");

    expect(mockSendMessage).toHaveBeenCalledWith(
      "123@s.whatsapp.net",
      expect.objectContaining({
        text: `📞 Need help? Contact us at +52 123-456-7890.`,
      })
    );
  });

  it("should send an 'unknown command' message for any other command", async () => {
    await commandProcessor.processCommand("123@s.whatsapp.net", "unknown");

    expect(mockSendMessage).toHaveBeenCalledWith(
      "123@s.whatsapp.net",
      expect.objectContaining({
        text: `⚠️ Unknown command. Send *menu* to see available options.`,
      })
    );
  });
});
