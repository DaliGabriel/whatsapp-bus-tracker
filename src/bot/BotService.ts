import makeWASocket, {
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  WASocket,
} from "@whiskeysockets/baileys";
import { logger } from "./constants";
import * as qrcode from "qrcode-terminal"; // Ensure QR code module is properly imported

export class BotService {
  private sock: WASocket | null = null;
  private state: any;
  private saveCreds: () => void = () => {};

  constructor() {}

  async initialize(): Promise<WASocket> {
    const { state, saveCreds } = await useMultiFileAuthState(
      "/app/auth_info_baileys" // Ensure auth state is persistent
    );
    this.state = state;
    this.saveCreds = saveCreds;

    const { version } = await fetchLatestBaileysVersion();
    this.sock = makeWASocket({
      version,
      auth: this.state,
      printQRInTerminal: true, // ✅ ENABLE QR CODE DISPLAY
      logger: logger,
      browser: ["WhatsApp Bot", "Chrome", "1.0"], // ✅ AVOID WHATSAPP SECURITY ISSUES
    });

    this.setupEventListeners();
    return this.sock;
  }

  private setupEventListeners() {
    if (!this.sock) return;

    this.sock.ev.on("creds.update", this.saveCreds);

    this.sock.ev.on(
      "connection.update",
      ({ connection, lastDisconnect, qr }) => {
        if (qr) {
          logger.debug("Connection update received:", { connection, qr });
          qrcode.generate(qr, { small: true }); // ✅ SHOW QR CODE IN TERMINAL
        }

        if (connection === "open") {
          console.log("✅ Bot is connected!");
        }

        if (connection === "close") {
          const shouldReconnect = lastDisconnect?.error; // ✅ Prevent loop if session is invalid

          console.log(
            "❌ Disconnected. Reason:",
            lastDisconnect?.error || "Unknown"
          );

          if (shouldReconnect) {
            console.log("🔄 Reconnecting...");
            this.initialize();
          } else {
            console.error(
              "🚨 SESSION EXPIRED: You need to scan the QR code again."
            );
          }
        }
      }
    );
  }

  getSocket(): WASocket | null {
    return this.sock;
  }
}
