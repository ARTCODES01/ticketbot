import { PermissionFlagsBits, EmbedBuilder } from "discord.js";

/**
 * @type {import("../..").Mcommand}
 */
export default {
  name: "ticketmods",
  description: "Manage ticket mods.",
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
      case "add":
        {
          const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args.at(1));

          if (!member) {
            return await client.sendEmbed(
              message,
              `> <a:dot:1132753415798276236> mention a member to add as a ticket mod.`
            );
          }

          data.mods.push(member.id);
          client.tickets.set(`tickets-${message.guildId}`, data);
          return client.sendEmbed(
            message,
            `> <:saintess_approve:1132745067921162291> ${member}: Got added as a Ticket Mod.`
          );
        }
        break;
      case "remove":
        {
          const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args.at(1));

          if (!member) {
            return await client.sendEmbed(
              message,
              `> <a:dot:1132753415798276236> mention a member to remove from ticket mod`
            );
          }

          data.mods = data.mods.filter((mod) => mod !== member.id);
          client.tickets.set(`tickets-${message.guildId}`, data);
          return client.sendEmbed(
            message,
            `> <:saintess_approve:1132745067921162291> ${member}: Removed as ticket mod.`
          );
        }
        break;
      case "list":
        {
          if (!data.mods.length) {
            return client.sendEmbed(message, `> <a:dot:1132753415798276236> There are 0 ticket mods`);
          } else {
            return message.channel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor("#ff93e0")
                  .setTitle("Ticket System Mods List")
                  .setDescription(
                    data.mods
                      .map((mod) => `> <:__:1132746132548751360> <@${mod}>`)
                      .join(" ' ")
                      .substring(0, 4000)
                  )
                  .setFooter({
                    text: `${data.mods.length} Mods Avalible`,
                    iconURL: message.guild.iconURL(),
                  }),
              ],
            })
          }
        }
        break;

        default:
          {
            await client.sendEmbed(
              message,
              {
                title: "Command: ticketmods",
                description: "> Mange ticketmods.\n```Syntax: ,ticketmods <args> (@user)\nExample: ,ticketmods add @ilytess```",
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
