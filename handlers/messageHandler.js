import { Bot } from "./Client.js";
import { readdir } from "node:fs/promises";
import { logStatus } from "./functions.js";

/**
 *
 * @param {Bot} client
 */
export default async (client) => {
  // code
  try {
    const commandsDir = await readdir(`./Commands`);
    const items = await Promise.all(
      commandsDir.map(async (dir) => {
        const commands = await readdir(`./Commands/${dir}`);
        let filterCommands = commands.filter((f) => f.endsWith(".js"));
        for (const cmd of filterCommands) {
          /**
           * @type {import("../index.js").Scommand}
           */
          const command = await import(`../Commands/${dir}/${cmd}`).then(
            (r) => r.default
          );
          if (command.name) {
            client.commands.set(command.name, command);
            logStatus(command.name, true, "Message");
          } else {
            logStatus(command.name, false, "Message");
          }
        }
      })
    );
    await Promise.all(items);
  } catch (error) {
    console.log(error);
  }
};
