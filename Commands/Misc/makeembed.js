import { EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js";
import { embedbuilder, isValidEmbed } from "../../handlers/functions.js";

/**
 * @type {import("../..").Mcommand}
 */
export default {
  name: "make-embed",
  description: "build your embed",
  userPermissions: PermissionFlagsBits.EmbedLinks,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Misc",
  cooldown: 5,

  run: async (client, message, args, prefix) => {
    // Code

    /**
     * @type {import("../..").builderData}
     */
    let data = await embedbuilder(client, message);

    await client.sendEmbed(message, `mention a channel to send embed`);

    const collected = await message.channel.awaitMessages({
      filter: (m) => m.author.id === message.author.id,
      errors: ["time"],
      max: 1,
      time: 30000,
    });

    const channelId = collected.first().content.trim();

    /**
     * @type {TextChannel}
     */
    let channel =
      collected.first().mentions.channels.first() ||
      message.guild.channels.cache.get(channelId) ||
      (await message.guild.channels.fetch(channelId))?.get(channelId);

    if (channel?.id) {
      if (isValidEmbed(data?.embed)) {
        await channel.send({
          content: data?.message || "",
          embeds: [EmbedBuilder.from(data?.embed)],
        });
      } else {
        await channel.send({
          content: data?.message || "",
        });
      }
      return client.sendEmbed(message, `<:saintess_approve:1132745067921162291> Embed got sent in ${channel}`);
    } else {
      await client.sendEmbed(message, `<:__:1132746132548751360> invalid channel.`);
    }
  },
};
