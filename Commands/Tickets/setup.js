import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";

/**
 * @type {import("../..").Mcommand}
 */
export default {
  name: "tsetup", // Update command name to "tsetup"
  description: "Setup Ticket System",
  userPermissions: PermissionFlagsBits.ManageGuild,
  botPermissions: PermissionFlagsBits.ManageChannels,
  category: "Tickets",
  cooldown: 5,

  run: async (client, message, args, prefix) => {
    // Code
    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args.at(0));

    const categoryID = args.at(1);

    if (!channel || !categoryID) {
      return client.sendEmbed(
        message,
        {
          title: "Command: tsetup",
          description:
            "> Setup the ticket system.\n```Syntax: ,tsetup (#channel) (categoryID)\nExample: ,tsetup #tickets 1128492688690393202```",
          color: 0xff93e0,
          author: {
            name: `Command: tsetup`,
            icon_url: client.user.avatarURL(), // Use client.user.avatarURL() for bot's avatar URL
          },
        }
      );
    }

    const row = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setCustomId("create-ticket")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("<:tickets_saintess:1132758307942191235>"),
    ]);

    /**
     * @type {import("../..").TicketData}
     */
    const data = await client.tickets.get(`tickets-${message.guildId}`);

    const embedData = data?.embed?.ticketSetup;

    const color = embedData?.color || "#ff93e0"; // Use default color if not provided

    const embed = new EmbedBuilder()
      .setColor("#ff93e0") // Use the provided color or the default one
      .setTitle(embedData.title)
      .setImage(embedData.image)
      .setThumbnail(embedData.thumbnail)
      .setFooter({
        text: embedData.footer.text,
        iconURL: message.guild.iconURL(),
      })
      .setAuthor({
        name: embedData.author.name,
        iconURL: message.guild.iconURL(),
      })
      .setDescription(embedData.description);

    let msg = await channel.send({
      embeds: [embed],
      components: [row],
    });

    channel.permissionOverwrites.edit(message.guild.roles.everyone, {
      SendMessages: false,
    });

    await client.tickets.set(`tickets-${message.guildId}`, {
      channel: channel.id,
      ticketId: msg.id,
      categoryId: categoryID,
      embed: data?.embed,
      loggingChannel: "",
      tickets: [],
      assignedTickets: [],
    });

    return client.sendEmbed(message, `> <:saintess_approve:1132745067921162291> Ticket system successfully set up in ${channel}.`);
  },
};
