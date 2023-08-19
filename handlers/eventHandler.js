import { Bot } from "./Client.js";
import { readdir } from "node:fs/promises";

/**
 *
 * @param {Bot} client
 */
export default async (client) => {
  // code

  try {
    const eventfiles = await readdir("./events");
    const eventfilesFiltered = eventfiles.filter((f) => f.endsWith(".js"));
    for (const file of eventfilesFiltered) {
      const event = await import(`../events/${file}`).then((r) => r.default);
    }
  } catch (error) {
    console.log(error);
  }
};
