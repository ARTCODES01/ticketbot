import { PermissionFlagsBits } from "discord.js";

/**
 * @type {import("../..").Mcommand}
 */
export default {
  name: "ticketlogger",
  description: "Setup Ticket Logging System",
  userPermissions: PermissionFlagsBits.ManageGuild,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Tickets",
  cooldown: 5,

  run: async (client, message, args, prefix) => {
    // Code
    const choice = args.at(0);
    /**
     * @type {import("../..").TicketData}
     */
    const data = await client.tickets.get(`tickets-${message.guildId}`);

    switch (choice) {
      case "on":
        {
          let channel =
            message.mentions.channels.first() ||
            message.guild.channels.cache.get(args.at(1));

          if (!channel) {
            return client.sendEmbed(
              message,
              `> <:__:1132746132548751360> Mention channel to setup the zticket logging system`
            );
          }

          data.logging.enable = true;
          data.logging.channelId = channel.id;

          await client.tickets.set(`tickets-${message.guildId}`, data);

          return client.sendEmbed(
            message,
            `> <:saintess_approve:1132745067921162291> Ticket loggin setup in ${channel}.`
          );
        }
        break;
      case "off":
        {
          data.logging.enable = false;
          data.logging.channelId = null;

          await client.tickets.set(`tickets-${message.guildId}`, data);

          return client.sendEmbed(message, `> <:saintess_approve:1132745067921162291> Ticket logging has been disabled.`);
        }
        break;

      default:
        {
          await client.sendEmbed(
            message,
            {
              title: "Command: ticketlogger",
              description: "> Setup ticket logging.\n```Syntax: ,ticketlogger <subcommand> (#channel)\nExample: ,ticketlogger on #ticket-logs```",
              color: 0xff93e0,
              author: {
                name: `@saintess help`,
                icon_url: client.user.avatarURL(), // Use client.user.avatarURL() for bot's avatar URL
              },
            }
          );
        }
        break;
    }
  },
};
