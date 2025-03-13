import { PrismaClient } from "@prisma/client";
import { db } from "../src/bot/db"; // Adjust path as needed

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    message: { create: jest.fn() },
    busLocation: {
      findFirst: jest.fn(),
      upsert: jest.fn(),
    },
    subscription: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      findMany: jest.fn(),
    },
  };

  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

// Explicitly cast PrismaClient methods as jest.MockedFunctions
const mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;

describe("Database Functions", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  test("saveMessage should call Prisma with correct data", async () => {
    const senderId = "user123";
    const content = "Hello, world!";

    await db.saveMessage(senderId, content);

    expect(mockPrisma.message.create).toHaveBeenCalledWith({
      data: { senderId, content },
    });
  });

  test("getLastBusLocation should fetch the latest bus location", async () => {
    const mockLocation = {
      id: "1",
      location: "12.345,67.890",
      updatedAt: new Date(),
    };

    // Ensure TypeScript recognizes this as a mocked function
    (mockPrisma.busLocation.findFirst as jest.Mock).mockResolvedValue(
      mockLocation
    );

    const result = await db.getLastBusLocation();

    expect(mockPrisma.busLocation.findFirst).toHaveBeenCalledWith({
      orderBy: { updatedAt: "desc" },
    });
    expect(result).toEqual(mockLocation);
  });

  test("updateBusLocation should upsert the bus location", async () => {
    const location = "12.345,67.890";

    await db.updateBusLocation(location);

    expect(mockPrisma.busLocation.upsert).toHaveBeenCalledWith({
      where: { id: "1" },
      update: { location },
      create: { id: "1", location },
    });
  });

  test("isUserSubscribed should return true if user is subscribed", async () => {
    const chatId = "user123";
    (mockPrisma.subscription.findUnique as jest.Mock).mockResolvedValue({
      chatId,
    });

    const result = await db.isUserSubscribed(chatId);

    expect(mockPrisma.subscription.findUnique).toHaveBeenCalledWith({
      where: { chatId },
    });
    expect(result).toBe(true);
  });

  test("isUserSubscribed should return false if user is not subscribed", async () => {
    const chatId = "user123";
    (mockPrisma.subscription.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await db.isUserSubscribed(chatId);

    expect(mockPrisma.subscription.findUnique).toHaveBeenCalledWith({
      where: { chatId },
    });
    expect(result).toBe(false);
  });

  test("subscribeUser should upsert a new subscription", async () => {
    const chatId = "user123";

    await db.subscribeUser(chatId);

    expect(mockPrisma.subscription.upsert).toHaveBeenCalledWith({
      where: { chatId },
      update: {},
      create: { chatId },
    });
  });

  test("getSubscribedUsers should return all subscribers", async () => {
    const mockSubscribers = [{ chatId: "user123" }, { chatId: "user456" }];
    (mockPrisma.subscription.findMany as jest.Mock).mockResolvedValue(
      mockSubscribers
    );

    const result = await db.getSubscribedUsers();

    expect(mockPrisma.subscription.findMany).toHaveBeenCalled();
    expect(result).toEqual(mockSubscribers);
  });
});
