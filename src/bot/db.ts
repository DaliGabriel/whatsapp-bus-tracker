import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const db = {
  async saveMessage(senderId: string, content: string) {
    return await prisma.message.create({
      data: {
        senderId,
        content,
      },
    });
  },
  async getLastBusLocation() {
    return await prisma.busLocation.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });
  },
  async updateBusLocation(location: string) {
    return await prisma.busLocation.upsert({
      where: { id: "1" },
      update: { location },
      create: { id: "1", location },
    });
  },
  async isUserSubscribed(chatId: string): Promise<boolean> {
    const subscription = await prisma.subscription.findUnique({
      where: { chatId },
    });
    return !!subscription; // Returns true if subscription exists, false otherwise
  },
  async subscribeUser(chatId: string) {
    return await prisma.subscription.upsert({
      where: { chatId },
      update: {},
      create: { chatId },
    });
  },
  async getSubscribedUsers() {
    return await prisma.subscription.findMany();
  },
};
