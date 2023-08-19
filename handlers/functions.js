import {
  CommandInteraction,
  Collection,
  Colors,
  Message,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonStyle,
  ButtonBuilder,
} from "discord.js";
import { Bot } from "./Client.js";

/**
 *
 * @param {CommandInteraction} interaction
 * @param {String} cmd
 */
export function cooldown(interaction, cmd) {
  if (!interaction || !cmd) return;
  let { client, member } = interaction;
  if (!client.cooldowns.has(cmd.name)) {
    client.cooldowns.set(cmd.name, new Collection());
  }
  const now = Date.now();
  const timestamps = client.cooldowns.get(cmd.name);
  const cooldownAmount = cmd.cooldown * 1000;
  if (timestamps.has(member.id)) {
    const expirationTime = timestamps.get(member.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000; //get the lefttime
      //return true
      return timeLeft;
    } else {
      timestamps.set(member.id, now);
      setTimeout(() => timestamps.delete(member.id), cooldownAmount);
      return false;
    }
  } else {
    timestamps.set(member.id, now);
    setTimeout(() => timestamps.delete(member.id), cooldownAmount);
    return false;
  }
}

export function logStatus(name, isLoaded, type) {
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  const statusIcon = isLoaded ? "\x1b[32m✅\x1b[0m" : "\x1b[31m❌\x1b[0m";
  const statusText = isLoaded ? "Loaded" : "Not Loaded";
  console.log(
    `[${date} ${time}] ${type} : ${name} | Status: ${statusIcon} ${statusText}`
  );
}

/**
 *
 * @param {Bot} client
 * @param {String} guildID
 * @param {String} userID
 */
export async function databasing(client, guildID, userID) {
  // code
  await client.tickets.ensure(`tickets-${guildID}`, {
    channel: null,
    ticketId: null,
    embed: {
      ticketSetup: {
        title: "<:tickets_saintess:1132758307942191235> Tickets",
        description: "> <a:dot:1132753415798276236> Click to open a ticket.",
        color: "#ff93e0", // Replace with your desired color, or use Colors.Blurple if defined
        footer: {
          text: "@saintess",
          iconURL: client.user.avatarURL(),
        },
        image: null,
        thumbnail: null,
        author: {
          name: null,
          iconURL: null,
        },
      },
      ticketWelcome: {
        title: "<:tickets_saintess:1132758307942191235> Greetings",
        description: `Hello {user},\nThank you for creating a ticket.\n Our support team will assist you shortly.`,
        color: "#ff93e0", // Replace with your desired color, or use Colors.Blurple if defined
        footer: {
          text: "@saintess",
          iconURL: null,
        },
        image: null,
        thumbnail: null,
        author: {
          name: null,
          iconURL: null,
        },
      },
    },
    categoryId: null,
    logging: {
      enable: false,
      channelId: null,
    },
    tickets: [
      {
        userId: null,
        channelId: null,
        ticketName: null,
        isDeleted: false,
      },
    ],
    assignedTickets: [],
    mods: [],
  });
}

/**
 * @type {import("../index.js").replaceValues}
 */
export function replaceValues(message, replacements) {
  let replacedMessage = message;
  Object.entries(replacements).forEach(([key, value]) => {
    replacedMessage = replacedMessage.replace(`{${key}}`, value);
  });
  return replacedMessage;
}

/**
 *
 * @param {Bot} client
 * @param {Message} message
 */
export async function embedbuilder(client, message) {
  // code
  return new Promise(async (resolve, reject) => {
    const embed = new EmbedBuilder().setColor('#ff93e0');
    const testembed = new EmbedBuilder()
      .setColor('#ff93e0')
      .setDescription(`@saintes`);

    /**
     * @type {import("../index.js").builderData}
     */
    const data = {};

    const selectOptions = [
      {
        label: "Message Content",
        description: `Edit Message Content`,
        value: "message_content",
      },
      {
        label: "Author URL",
        description: `Edit Url Of Author`,
        value: "author_url",
      },
      {
        label: "Author Text",
        description: `Edit Text Of Author`,
        value: "author_text",
      },
      {
        label: "Author Icon",
        description: `Edit Icon Of Author`,
        value: "author_icon",
      },
      {
        label: "Title",
        description: `Edit Title Of Embed`,
        value: "embed_title",
      },
      {
        label: "Description",
        description: `Edit Description Of Embed`,
        value: "embed_description",
      },
      {
        label: "Image",
        description: `Edit Image Of Embed`,
        value: "embed_image",
      },
      {
        label: "Thumbnail",
        description: `Edit Thumbnail Of Embed`,
        value: "embed_thumbnail",
      },
      {
        label: "Color",
        description: `Edit Color Of Embed`,
        value: "embed_color",
      },
      {
        label: "Footer Icon",
        description: `Edit Icon Of Footer`,
        value: "footer_icon",
      },
      {
        label: "Footer Text",
        description: `Edit Text Of Footer`,
        value: "footer_text",
      },
    ];

    const btnrow = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setLabel("Finish")
        .setStyle(ButtonStyle.Success)
        .setCustomId("setDone"),
      new ButtonBuilder()
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("setDelete"),
    ]);

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("message_edit_embeds")
        .setPlaceholder("Nothing selected")
        .addOptions(
          selectOptions.map((option, index) => {
            return {
              label: option.label,
              value: option.value,
              description: option.description,
              emoji: "<:folders:1133484957499670568>",
            };
          })
        )
    );

    let msg = await message.channel.send({
      // content: `Select Option Below To Edit Embed`,
      embeds: [testembed],
      components: [row, btnrow],
      // ephemeral: true,
    });

    let filter = (i) => i.user.id == message.member.id;
    let collector = await msg.createMessageComponentCollector({
      filter: filter,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.isStringSelectMenu()) {
        let value = interaction.values.at(0);
        let option = interaction.component.options.find(
          (c) => c.value == value
        );

        const modal = new ModalBuilder()
          .setCustomId("embed_builder")
          .setTitle(`Embed Builder`);

        await modal.addComponents(
          new ActionRowBuilder().setComponents(
            new TextInputBuilder()
              .setCustomId(String(value))
              .setLabel(String(`${option.label} : ${option.description}`))
              .setMinLength(5)
              .setMaxLength(getModalMaxLength(value))
              .setPlaceholder(option.description)
              .setRequired(true)
              .setStyle(getModalType(value))
          )
        );

        await interaction.showModal(modal);

        // embed edit
        client.on("interactionCreate", async (interaction) => {
          try {
            if (interaction.isModalSubmit()) {
              await interaction.deferUpdate().catch((e) => {});
              if (interaction.customId == "embed_builder") {
                let content = interaction.fields.getTextInputValue(value);
                if (value == "author_url") {
                  embed.setAuthor({ url: content });
                  testembed.setAuthor({ url: content });
                } else if (value == "author_text") {
                  embed.setAuthor({ name: content });
                  testembed.setAuthor({ name: content });
                } else if (value == "author_icon") {
                  embed.setAuthor({ iconURL: content });
                  testembed.setAuthor({ iconURL: content });
                } else if (value == "embed_color") {
                  const color = content; // Assuming content is a valid color value (e.g., #FF0000)
                  embed.setColor(color);
                  testembed.setColor(color);
                } else if (value == "embed_title") {
                  embed.setTitle(content);
                  testembed.setTitle(content);
                } else if (value == "embed_description") {
                  embed.setDescription(content);
                  testembed.setDescription(content);
                } else if (value == "embed_image") {
                  try {
                    embed.setImage(content);
                    testembed.setImage(content);
                  } catch (e) {
                    client.sendEmbed(interaction, e.message, true);
                  }
                } else if (value == "embed_thumbnail") {
                  try {
                    embed.setThumbnail(String(content));
                    testembed.setThumbnail(String(content));
                  } catch (e) {
                    client.sendEmbed(interaction, e.message, true);
                  }
                } else if (value == "footer_text") {
                  embed.setFooter({ text: content });
                  testembed.setFooter({ text: content });
                } else if (value == "footer_icon") {
                  embed.setFooter({ iconURL: content });
                  testembed.setFooter({ iconURL: content });
                } else if (value == "message_content") {
                  data["message"] = content;
                  msg.edit({
                    content: content,
                  });
                }

                msg.edit({
                  embeds: [testembed],
                });
              }
            }
          } catch (e) {}
        });
      }

      if (interaction.isButton()) {
        if (interaction.customId === "setDone") {
          data["embed"] = embed.data;
          resolve(data);
          msg.delete().catch(null);
        } else if (interaction.customId === "setDelete") {
          reject("cancel embed builder");
          msg.delete().catch(null);
        }
      }
    });
  });
}

export function getModalType(type) {
  if (type === "embed_description") {
    return TextInputStyle.Paragraph;
  } else if (type === "message_content") {
    return TextInputStyle.Paragraph;
  } else {
    return TextInputStyle.Short;
  }
}

export function getModalMaxLength(type) {
  if (type == "embed_description") {
    return 4000;
  } else if (type == "embed_title" || type == "author_text") {
    return 255;
  } else if (type == "footer_text") {
    return 2048;
  } else if (type === "message_content") {
    return 1999;
  } else {
    return 100;
  }
}

export function isImageUrl(url) {
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|svg|webp|tiff)$/i;
  return imageExtensions.test(url);
}

export function isValidEmbed(embed) {
  // Check if the embed is an object
  if (typeof embed !== "object" || embed === null) {
    return false;
  }

  if (!embed.title || !embed.description) {
    return false;
  }

  return true;
}
