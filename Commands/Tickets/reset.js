import { PermissionFlagsBits, EmbedBuilder } from "discord.js";

/**
 * @type {import("../..").Mcommand}
 */
export default {
  name: "treset",
  description: "Reset Ticket System",
  userPermissions: PermissionFlagsBits.Administrator,
  botPermissions: PermissionFlagsBits.ManageMessages,
  category: "Tickets",
  cooldown: 5,

  run: async (client, message, args, prefix) => {
    // Code

    const msg = await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("#ff93e0")
          .setDescription("> <a:h_kirbyfloat:1131552540253753374> resetting the ticket system..."),
      ],
    });

    /**
     * @type {import("../..").TicketData}
     */
    const data = await client.tickets.get(`tickets-${message.guildId}`);

    const ticketChannel =
      message.guild.channels.cache.get(data.channel) ||
      (await message.guild.channels.fetch(data.channel)).get(data.channel);

    if (ticketChannel) await ticketChannel?.delete().catch(() => {});

    data.tickets.forEach(async (ticket) => {
      const channel =
        message.guild.channels.cache.get(ticket.channelId) ||
        (await message.guild.channels.fetch(ticket.channelId)).get(
          ticket.channelId
        );
      if (channel) await channel?.delete().catch(() => {});
    });

    await client.tickets.delete(`tickets-${message.guildId}`);

    msg.edit({
      embeds: [
        new EmbedBuilder()
          .setColor("#ff93e0")
          .setDescription(`> <:saintess_approve:1132745067921162291> succesfully reseted the **ticket system.**`),
      ],
    });
  },
};
