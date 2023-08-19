import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { embedbuilder } from "../../handlers/functions.js";

/**
 * @type {import("../..").Mcommand}
 */
export default {
  name: "configembed",
  description: "Customize Ticket Embeds",
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
      case "ticketwelcome":
        {
          const embedData = data?.embed?.ticketWelcome;
          const newData = await embedbuilder(client, message); // Use a different variable name, e.g., newData
          const newembed = { ...embedData, ...newData?.embed }; // Use newData instead of data here
          data.embed.ticketWelcome = newembed;
        
          await client.tickets.set(`tickets-${message.guildId}`, data);
        
          const botUser = client.user; // Get the bot's user object
          const botAvatarURL = botUser.displayAvatarURL(); // Get the bot's avatar URL
        
          client.sendEmbed(
            message,
            {
              title: "Updated ticket welcome embed",
              description: "> <:saintess_approve:1132745067921162291> The ticket welcome embed has been updated.",
              color: 0xff93e0,
              author: {
                name: botUser.username,
                icon_url: botAvatarURL
              }
            }
          );
        } 
        break;        
      case "ticketsetup":
        {
          const embedData = data?.embed?.ticketSetup;
          const embed = await embedbuilder(client, message);
          const newembed = { ...embedData, ...embed };

          data.embed.ticketSetup = newembed;

          await client.tickets.set(`tickets-${message.guildId}`, data);

          const ticketChannel = message.guild.channels.cache.get(data.channel);
          const ticketMessage =
            ticketChannel.messages.cache.get(data.ticketId) ||
            (await ticketChannel.messages.fetch(data.ticketId)).first();

          ticketMessage.edit({
            embeds: [EmbedBuilder.from(newembed)],
          });

          const botUser = client.user; // Get the bot's user object
          const botAvatarURL = botUser.displayAvatarURL(); // Get the bot's avatar URL

          client.sendEmbed(
            message,
            {
              title: "Updated the embed",
              description: "> <:saintess_approve:1132745067921162291> The ticket setup embed has been updated",
              color: 0xff93e0,
              author: {
                name: "@saintess",
                icon_url: botAvatarURL
              }
            }
          );
        }
        break;

      default:
        {
          const botUser = client.user; // Get the bot's user object
          const botAvatarURL = botUser.displayAvatarURL(); // Get the bot's avatar URL

          client.sendEmbed(
            message,
            {
              title: "Command: configembed",
              description: "> Config embeds for the ticket system\n```Syntax: ,configembed (Variable)\nExample: ,configembed ticketwelcome```",
              color: 0xff93e0,
              author: {
                name: "@saintess help",
                icon_url: botAvatarURL
              }
            }
          );
        }
        break;        
    }
  },
};
