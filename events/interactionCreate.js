import { EmbedBuilder, InteractionType } from "discord.js";
import client from "../bot.js";
import { databasing, isImageUrl } from "../handlers/functions.js";

client.on("interactionCreate", async (interaction) => {
  if (interaction.user.bot || !interaction.guild) return;
  await databasing(client, interaction.guildId, interaction.user.id);

  if (interaction.type === InteractionType.ApplicationCommand) {
    // code
    if (interaction.commandName === "setavatar") {
      const file = interaction.options.getAttachment("file");

      if (isImageUrl(file.url)) {
        let msg = await client.sendEmbed(interaction, `Changing Avatar Wait`);
        await client.user.setAvatar(file.url);
        return await msg.edit({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Bot Avatar Changed`)
              .setImage(String(file.url))
              .setColor("#ff93e0"),
          ],
        });
      } else {
        return await client.sendEmbed(interaction, `file is not valid image`);
      }
    }
  }
});
