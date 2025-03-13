import { LocationHandler } from "../src/bot/LocationHandler"; // Adjust path if needed
import { WASocket } from "@whiskeysockets/baileys";
import { db } from "../src/bot/db";

jest.mock("../src/bot/db");

describe("LocationHandler", () => {
  let mockSocket: any;
  let locationHandler: LocationHandler;
  let mockSendMessage: jest.Mock;

  beforeEach(() => {
    mockSendMessage = jest.fn();
    mockSocket = {
      sendMessage: mockSendMessage,
    };

    locationHandler = new LocationHandler(mockSocket as WASocket);
  });

  it("should update the bus location and notify the sender", async () => {
    (db.updateBusLocation as jest.Mock).mockResolvedValue(undefined);

    const chatId = "123@s.whatsapp.net";
    const locationMessage = {
      degreesLatitude: "12.345",
      degreesLongitude: "67.890",
    };

    await locationHandler.handleLocationUpdate(chatId, locationMessage);

    expect(db.updateBusLocation).toHaveBeenCalledWith("12.345,67.890");

    expect(mockSendMessage).toHaveBeenCalledWith(
      chatId,
      expect.objectContaining({
        text: `✅ Bus location updated! 📍: https://www.google.com/maps?q=12.345,67.890`,
      })
    );
  });

  it("should notify subscribed users except the sender", async () => {
    (db.getSubscribedUsers as jest.Mock).mockResolvedValue([
      { chatId: "456@s.whatsapp.net" },
      { chatId: "789@s.whatsapp.net" },
    ]);

    const chatId = "123@s.whatsapp.net"; // Sender's chat ID
    const locationMessage = {
      degreesLatitude: "12.345",
      degreesLongitude: "67.890",
    };

    await locationHandler.handleLocationUpdate(chatId, locationMessage);

    expect(mockSendMessage).toHaveBeenCalledWith(
      "456@s.whatsapp.net",
      expect.objectContaining({
        text: `🚨 Bus Update! 🚌: https://www.google.com/maps?q=12.345,67.890`,
      })
    );

    expect(mockSendMessage).toHaveBeenCalledWith(
      "789@s.whatsapp.net",
      expect.objectContaining({
        text: `🚨 Bus Update! 🚌: https://www.google.com/maps?q=12.345,67.890`,
      })
    );

    expect(mockSendMessage).not.toHaveBeenCalledWith(
      chatId, // Ensure sender does not receive their own update
      expect.objectContaining({
        text: expect.stringContaining("Bus Update"),
      })
    );
  });
});
