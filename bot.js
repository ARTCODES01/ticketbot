import { config } from "dotenv";
config();
import { Bot } from "./handlers/Client.js";

const client = new Bot();

// login bot
client.build(client.config.TOKEN);

client.login(client.config.TOKEN);

export default client;

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise);
  console.error("Reason:", reason);
  // Additional error handling code can be added here
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // Additional error handling code can be added here
});
