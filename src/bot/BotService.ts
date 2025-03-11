import makeWASocket, {
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  WASocket,
} from "@whiskeysockets/baileys";
import { logger } from "./constants";

export class BotService {
  private sock: WASocket | null = null;
  private state: any;
  private saveCreds: () => void = () => {};

  constructor() {}

  async initialize(): Promise<WASocket> {
    const { state, saveCreds } = await useMultiFileAuthState(
      "auth_info_baileys"
    );
    this.state = state;
    this.saveCreds = saveCreds;

    const { version } = await fetchLatestBaileysVersion();
    this.sock = makeWASocket({
      version,
      auth: this.state,
      printQRInTerminal: false,
      logger: logger,
    });

    this.setupEventListeners();
    return this.sock;
  }

  private setupEventListeners() {
    if (!this.sock) return;

    this.sock.ev.on("creds.update", this.saveCreds);

    this.sock.ev.on("connection.update", ({ connection, qr }) => {
      if (qr) {
        logger.debug("Connection update received:", { connection, qr });
        //*qrcode should init on this way
        let qrcode = require("qrcode-terminal");
        qrcode.generate(qr, { small: true });
      }
      if (connection === "open") {
        console.log("✅ Bot is connected!");
      }
      if (connection === "close") {
        console.log("❌ Disconnected. Reconnecting...");
        this.initialize();
      }
    });
  }

  getSocket(): WASocket | null {
    return this.sock;
  }
}
