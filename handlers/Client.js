import {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  EmbedBuilder,
} from "discord.js";
import Josh from "@joshdb/core";
import JoshJSON from "@joshdb/json";
import config from "../settings/config.js";

export class Bot extends Client {
  constructor() {
    super({
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.User,
      ],
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.DirectMessages,
      ],
      shards: "auto",
      failIfNotExists: false,
      allowedMentions: {
        parse: ["everyone", "roles", "users"],
        users: [],
        roles: [],
        repliedUser: false,
      },
    });

    // global variables
    this.config = config;
    this.commands = new Collection();
    this.cooldowns = new Collection();
    this.events = new Collection();
    this.tickets = new Josh({
      name: "tickets",
      provider: JoshJSON,
    });
  }

  async build(token) {
    await loadHandlers(this);
    // this.login(token).catch((e) => console.log(e));
  }

  /**
   * @type {import("../index.js").sendEmbed}
   */
  async sendEmbed(interaction, data, ephemeral = false) {
    if (typeof data === "string") {
      return await this.send(interaction, {
        embeds: [
          new EmbedBuilder()
            .setColor(this.config.embed.color)
            .setDescription(`${data.substring(0, 3000)}`),
        ],
        ephemeral: ephemeral,
      });
    } else {
      return await this.send(interaction, {
        embeds: [data],
        ephemeral: ephemeral,
      });
    }
  }

  getFooter(user) {
    return {
      text: `Requested By ${user.username}`,
      iconURL: user.displayAvatarURL(),
    };
  }

  /**
   * @type {import("../index.js").send}
   */
  async send(interaction, data) {
    try {
      if (interaction.deferred || interaction.replied) {
        return await interaction.followUp(data).catch((e) => {});
      } else {
        return await interaction.reply(data).catch((e) => {});
      }
    } catch (error) {
      // console.error(error);
      await interaction.deferReply().catch((e) => {});
      return await interaction.followUp(data);
    }
  }
}

async function loadHandlers(client) {
  ["messageHandler", "eventHandler", "ticketSystem"].forEach(async (file) => {
    let handler = await import(`./${file}.js`).then((r) => r.default);
    await handler(client);
  });
}
