const {
  default: makeWASocket,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} = require("@whiskeysockets/baileys");
const pino = require("pino");

async function startBot() {
  // Use multi-file auth to store session
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  // Get latest WhatsApp version
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
    logger: pino({ level: "silent" }),
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, qr }) => {
    if (qr) {
      console.log("Scan this QR code with your new WhatsApp number:");
      const qrcode = require("qrcode-terminal");
      qrcode.generate(qr, { small: true });
    }
    if (connection === "open") {
      console.log("✅ Bot is connected!");
    }
    if (connection === "close") {
      console.log("❌ Disconnected. Reconnecting...");
      startBot();
    }
  });

  let busLocation = "Unknown";
  let lastUpdate = null;

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.key.fromMe && msg.message) {
      const chatId = msg.key.remoteJid;
      const text =
        msg.message.conversation || msg.message.extendedTextMessage?.text;

      console.log(`📩 Message from ${chatId}: ${text}`);

      if (text.toLowerCase() === "where is the bus?") {
        let time = "unknown";
        if (lastUpdate) {
          time = lastUpdate.toLocaleTimeString();
        }
        await sock.sendMessage(chatId, {
          text: `🚌 The bus is at: ${busLocation}\nLast Update: ${time}`,
        });
      }

      if (text.toLowerCase().startsWith("bus at ")) {
        let location = text.toLowerCase().replace("bus at ", "");
        busLocation = location;
        lastUpdate = new Date();
        await sock.sendMessage(chatId, {
          text: `✅ Location updated! The bus is now at: ${location}`,
        });
      }
    }
  });
}

startBot();
