import {
  ActivityType,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import client from "../bot.js";

client.on("ready", async () => {
  console.log(`> ${client.user.tag} is Ready !!`);
  client.user.setActivity({
    name: "saintess.vip/discord",
    type: ActivityType.Streaming,
    url: "https://www.youtube.com/watch?v=X5akW7MqILg",
});

  await client.application.commands.set([
    {
      name: "setavatar",
      description: `change the avatar of bot`,
      type: ApplicationCommandType.ChatInput,
      options: [
        {
          name: "file",
          description: "choose any image file for avatar",
          type: ApplicationCommandOptionType.Attachment,
          required: true,
        },
      ],
    },
  ]);
});
