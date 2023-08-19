import { PermissionFlagsBits } from "discord.js";

/**
 * @type {import("../..").Mcommand}
 */
export default {
  name: "ping",
  description: "Get the ping of the bot.",
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Misc",
  cooldown: 5,

  run: async (client, message, args, prefix) => {
    // Code
    return client.sendEmbed(message, `> <:Hvpink:1131293868688674946> Bot ping: \`${client.ws.ping}\``);
  },
};
