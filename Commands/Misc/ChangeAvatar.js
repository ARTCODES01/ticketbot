import { EmbedBuilder } from "discord.js";

export default {
  name: 'changeavatar',
  description: 'Change the bot avatar',
  aliases: ['ca'],
  run: async (client, message, args) => {
    const ownerIDs = message.client.config.Owners;
    if (!ownerIDs.includes(message.author.id)) {
      message.channel.send('Nice try lil bro.');
      return;
    }

    try {
      const newAvatarURL = args[0]; // Extract the URL from the command arguments
      await message.client.user.setAvatar(newAvatarURL);

      const embed = new EmbedBuilder()
        .setTitle('@saintess')
        .setDescription('> <:Hvpink:1131293868688674946> Bot avatar changed.')
        .setColor('#ff93e0')
        .setImage(message.client.user.displayAvatarURL());

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error while updating avatar:', error);

      const embed = new EmbedBuilder()
        .setTitle('Error Updating Avatar')
        .setDescription(`> <:saintess_x:1132745123483091087> error code: ${error.message}`)
        .setColor('#ff93e0');

      message.channel.send({ embeds: [embed] });
    }
  },
};
