import { EmbedBuilder } from "discord.js";

/**
 * @type {import("../index.js").TicketLogger}
 */
export default async ({ type, data, interaction, ticket, addedUser }) => {
  try {
    // code
    const loggingChannel = interaction.guild.channels.cache.get(
      data.logging.channelId
    );

    if (!data.logging.enable) return;

    switch (type) {
      case "create_ticket":
        {
          if (!ticket) return;
          loggingChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("#ff93e0")
                .setTitle("Ticket created <:tickets_saintess:1132758307942191235>")
                .setDescription(
                  `> <:saintess_approve:1132745067921162291> \`${ticket?.ticketName}\` <#${ticket?.channelId}> created by <@${ticket.userId}>.`
                )
                .setTimestamp(),
            ],
          });
        }
        break;
      case "delete_ticket":
        {
          loggingChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("#E81683")
                .setTitle("Ticket deleted <:tickets_saintess:1132758307942191235>")
                .setDescription(
                  `> <:saintess_approve:1132745067921162291> \`${ticket.ticketName}\` deleted by ${interaction.member}.`
                )
                .setTimestamp(),
            ],
          });
        }
        break;
      case "person_add":
        {
          loggingChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("#ff93e0")
                .setTitle("added a person to this ticket <:tickets_saintess:1132758307942191235>")
                .setDescription(
                  `> <:saintess_approve:1132745067921162291> ${addedUser}: added To \`${ticket.ticketName}\` by ${interaction.member}. `
                )
                .setTimestamp(),
            ],
          });
        }
        break;
      case "person_remove":
        {
          loggingChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("#E81683")
                .setTitle("removed a person form this ticket <:tickets_saintess:1132758307942191235>")
                .setDescription(
                  `> <:saintess_approve:1132745067921162291> ${addedUser}: removed from \`${ticket.ticketName}\` by ${interaction.member}. `
                )
                .setTimestamp(),
            ],
          });
        }
        break;
      case "ticket_transcript":
        {
          loggingChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setTitle("Ticket transcript generated <:tickets_saintess:1132758307942191235>")
                .setDescription(
                  `\`${ticket.ticketName}\`> <:saintess_approve:1132745067921162291> Ticket transcript generated by ${interaction.member}.`
                )
                .setTimestamp(),
            ],
          });
        }
        break;

      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
};
