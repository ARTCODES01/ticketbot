import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";
import { Bot } from "./Client.js";
import { createTranscript } from "discord-html-transcripts";
import TicketLogger from "./TicketLogger.js";
import { replaceValues } from "./functions.js";

/**
 *
 * @param {Bot} client
 */
export default async (client) => {
  try {
    client.on("interactionCreate", async (interaction) => {
      // code
      if (interaction.isButton()) {
        // code
        await interaction.deferUpdate().catch(() => {});
        /**
         * @type {import("../index.js").TicketData}
         */
        let data = await client.tickets.get(`tickets-${interaction.guildId}`);
        const TicketExist = data?.assignedTickets?.find(
          (userId) => userId === interaction.user.id
        );
        let ticket = data?.tickets?.find(
          (ticket) => ticket.channelId === interaction.channelId
        );

        const ticketChannel = interaction.guild.channels.cache.get(
          ticket?.channelId
        );

        switch (interaction.customId) {
          case "create-ticket":
            {
              console.log(ticket);
              if (TicketExist) {
                return await client.send(interaction, {
                  content: `> <:__:1132746132548751360>  you alr have a ticket: ${ticketChannel}.`,
                  ephemeral: true,
                });
              }

              const category = interaction.guild.channels.cache.get(
                data?.categoryId
              );

              const ticketChannelName = `ticket-${interaction.user.username.toLowerCase()}`;

              const ticketChannel = await interaction.guild.channels.create({
                name: ticketChannelName,
                parent: category?.id,
                reason: `Ticket for ${interaction.user.tag}.`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                  {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionFlagsBits.ViewChannel],
                  },
                  {
                    id: interaction.user.id,
                    allow: [
                      PermissionFlagsBits.ViewChannel,
                      PermissionFlagsBits.EmbedLinks,
                      PermissionFlagsBits.SendMessages,
                      PermissionFlagsBits.AttachFiles,
                    ],
                  },
                  ...data.mods.map((modId) => {
                    return {
                      id: modId,
                      allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.EmbedLinks,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.AttachFiles,
                        PermissionFlagsBits.ManageMessages,
                        PermissionFlagsBits.ManageChannels,
                      ],
                    };
                  }),
                ],
              });

              data?.assignedTickets?.push(interaction.user.id);
              data?.tickets?.push({
                userId: interaction.user.id,
                channelId: ticketChannel.id,
                ticketName: ticketChannelName,
                isDeleted: false,
              });
              await client.tickets.set(`tickets-${interaction.guildId}`, data);

              const embedData = data?.embed?.ticketWelcome;

              const replacements = {
                user: interaction.user,
              };

              const ticketEmbed = new EmbedBuilder()
                .setColor(embedData.color)
                .setTitle(embedData.title)
                .setImage(embedData.image)
                .setThumbnail(embedData.thumbnail)
                .setFooter({
                  text: embedData.footer.text,
                  iconURL: interaction.guild.iconURL(),
                })
                .setAuthor({
                  name: embedData.author.name,
                  iconURL: interaction.guild.iconURL(),
                })
                .setDescription(
                  replaceValues(embedData.description, replacements)
                );

              const ticketRow = new ActionRowBuilder().addComponents([
                new ButtonBuilder()
                  .setCustomId("ticket-add-person")
                  .setStyle(ButtonStyle.Secondary)
                  .setEmoji("<:saintess_plus:1132744953030774806>"),
                new ButtonBuilder()
                  .setCustomId("ticket-transcript")
                  .setStyle(ButtonStyle.Secondary)
                  .setEmoji("<:transcript:1132747910589726732>"),
                new ButtonBuilder()
                  .setCustomId("ticket-remove-person")
                  .setStyle(ButtonStyle.Secondary)
                  .setEmoji("<:saintess_minus:1132745019812483112>"),
                new ButtonBuilder()
                  .setCustomId("delete-ticket")
                  .setStyle(ButtonStyle.Secondary)
                  .setEmoji("<:trash:1132748833709891705>"),
              ]);

              await ticketChannel.send({
                content: `Greetings <@${interaction.user.id}>`,
                embeds: [ticketEmbed],
                components: [ticketRow],
              });

              data = await client.tickets.get(`tickets-${interaction.guildId}`);

              ticket = data?.tickets?.find(
                (ticket) => ticket.userId === interaction.user.id
              );

              await TicketLogger({
                client: client,
                data: data,
                interaction: interaction,
                ticket: ticket,
                type: "create_ticket",
              });

              return await client.send(interaction, {
                content: `> <:saintess_approve:1132745067921162291> Your ticket is Created ${ticketChannel}.`,
                ephemeral: true,
              });
            }
            break;
          case "delete-ticket":
            {
              if (!TicketExist && ticket?.isDeleted) {
                return await client.send(interaction, {
                  content: `> <:__:1132746132548751360>  Ticket not found or may be deleted from the database.`,
                  ephemeral: true,
                });
              }

              if (
                !data?.assignedTickets?.includes(interaction.user.id) &&
                !data?.mods?.includes(interaction.user.id) &&
                !interaction.member.permissions.has(
                  PermissionFlagsBits.Administrator
                )
              ) {
                return await client.send(interaction, {
                  content: `> <:saintess_x:1132745123483091087> You can't delete this ticket.`,
                  ephemeral: true,
                });
              }

              data.tickets = data.tickets.filter(
                (t) => t.userId !== ticket.userId
              );
              data.assignedTickets = data?.assignedTickets?.filter(
                (userid) => userid != interaction.user.id
              );
              ticket.isDeleted = true;

              await client.tickets.set(`tickets-${interaction.guildId}`, data);

              await client.send(interaction, {
                content: `> <:__:1132746132548751360> Your ticket will be deleted in 5 seconds.`,
                ephemeral: true,
              });

              setTimeout(async () => {
                await interaction.channel
                  .delete({ reason: `deleted by ${interaction.user.tag}` })
                  .then(async () => {
                    await TicketLogger({
                      client: client,
                      data: data,
                      interaction: interaction,
                      ticket: ticket,
                      type: "delete_ticket",
                    });
                  })
                  .catch((e) => {});
              }, 5000);
              return;
            }
            break;
          case "ticket-add-person":
            {
              if (!TicketExist && ticket?.isDeleted) {
                return await client.send(interaction, {
                  content: `> <:__:1132746132548751360> Ticket not found or may be deleted from the database.`,
                  ephemeral: true,
                });
              }

              const msg = await client.send(interaction, {
                content: `> <:__:1132746132548751360> Provide a user id to add to the ticket.`,
                ephemeral: true,
              });

              const collected = await interaction.channel.awaitMessages({
                filter: (m) => m.author.id === interaction.user.id,
                max: 1,
                time: 30000,
                errors: ["time"],
              });

              const userId = collected.first().content;

              collected
                .first()
                .delete()
                .catch((e) => {});

              const givenUser =
                interaction.guild.members.cache.get(userId) ||
                (await interaction.guild.members
                  .fetch(userId)
                  .catch((e) => {}));

              if (!givenUser) {
                return client.send(interaction, {
                  content: `> <:__:1132746132548751360> Provided user not found in the server`,
                  ephemeral: true,
                });
              }

              await ticketChannel.permissionOverwrites.create(givenUser, {
                ViewChannel: true,
                EmbedLinks: true,
                SendMessages: true,
                AttachFiles: true,
              });

              await TicketLogger({
                client: client,
                data: data,
                interaction: interaction,
                ticket: ticket,
                type: "person_add",
                addedUser: givenUser,
              });

              return client.send(interaction, {
                content: `> <:saintess_approve:1132745067921162291> ${givenUser}: Added to \ ${ticketChannel}\ .`,
                ephemeral: true,
              });
            }
            break;
          case "ticket-remove-person":
            {
              if (!TicketExist && ticket?.isDeleted) {
                return await client.send(interaction, {
                  content: `> <:__:1132746132548751360> Ticket not found or may be deleted from the database.`,
                  ephemeral: true,
                });
              }

              const msg = await client.send(interaction, {
                content: `> <a:dot:1132753415798276236> Provide a user id to remove from the ticket.`,
                ephemeral: true,
              });

              const collected = await interaction.channel.awaitMessages({
                filter: (m) => m.author.id === interaction.user.id,
                max: 1,
                time: 30000,
                errors: ["time"],
              });

              const userId = collected.first().content;

              collected
                .first()
                .delete()
                .catch((e) => {});

              const givenUser =
                interaction.guild.members.cache.get(userId) ||
                (await interaction.guild.members
                  .fetch(userId)
                  .catch((e) => {}));

              if (!givenUser) {
                return client.send(interaction, {
                  content: `> <:__:1132746132548751360> Provided user not found in the server`,
                  ephemeral: true,
                });
              }

              await ticketChannel.permissionOverwrites.delete(givenUser.id);

              await TicketLogger({
                client: client,
                data: data,
                interaction: interaction,
                ticket: ticket,
                type: "person_remove",
                addedUser: givenUser,
              });

              return client.send(interaction, {
                content: `> <:saintess_approve:1132745067921162291> ${givenUser}: removed from \ ${ticketChannel}\ .`,
                ephemeral: true,
              });
            }
            break;
          case "ticket-transcript":
            {
              if (!TicketExist && ticket?.isDeleted) {
                return await client.send(interaction, {
                  content: `> <:__:1132746132548751360> Ticket not found or may be deleted from database`,
                  ephemeral: true,
                });
              }

              const msg = await client.send(interaction, {
                embeds: [
                  new EmbedBuilder()
                    .setColor("#ff93e0")
                    .setDescription(
                      `> <a:h_kirbyfloat:1131552540253753374> Generating \ ${ticketChannel}\ Transcript ....`
                    ),
                ],
              });

              const transcriptAttachment = await createTranscript(
                ticketChannel,
                {
                  filename: `${ticket.ticketName}-transcript.html`,
                  saveImages: true,
                  footerText: `@saintess`,
                }
              );

              interaction.channel.send({
                content: `${interaction.user} \`${ticket.ticketName}\` Ticket Transcript`,
                files: [transcriptAttachment],
              });

              await TicketLogger({
                client: client,
                data: data,
                interaction: interaction,
                ticket: ticket,
                type: "ticket_transcript",
              });
              msg.edit({
                embeds: [
                  new EmbedBuilder()
                    .setColor("#ff93e0")
                    .setDescription(`> <:saintess_approve:1132745067921162291> Transcript generated.`),
                ],
              });
            }
            break;

          default:
            break;
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};
