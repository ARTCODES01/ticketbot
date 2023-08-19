import client from "../bot.js";
import { PermissionsBitField } from "discord.js";
import { cooldown, databasing } from "../handlers/functions.js";

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild || !message.id) return;
  await databasing(client, message.guildId, message.author.id);
  let prefix = client.config.PREFIX;
  let Owners = client.config.Owners;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();

  /**
   * @type {import("..").Mcommand}
   */
  const command =
    client.commands.get(cmd) ||
    client.commands.find((cmds) => cmds.aliases && cmds.aliases.includes(cmd));

  if (!command) return;
  if (command) {
    if (command.owneronly && !Owners.includes(message.author.id)) {
      return client.sendEmbed(
        message,
        `> <:__:1132746132548751360> Only ${Owners.map((m) => `<@${m}>`)} Can Use This Command`
      );
    } else if (
      command.userPermissions &&
      !message.member.permissions.has(
        PermissionsBitField.resolve(command.userPermissions)
      )
    ) {
      return client.sendEmbed(message, `> <:__:1132746132548751360> You don't have enough **Permissions.**`);
    } else if (
      command.botPermissions &&
      !message.guild.members.me.permissions.has(
        PermissionsBitField.resolve(command.botPermissions)
      )
    ) {
      return client.sendEmbed(message, `> <:__:1132746132548751360> I don't have enough **Permissions.**`);
    } else if (cooldown(message, command)) {
      return client.sendEmbed(
        message,
        `> <:__:1132746132548751360> You are on cooldown , wait \`${cooldown(
          message,
          command
        ).toFixed()}\` **Seconds**`
      );
    } else {
      command.run(client, message, args, prefix);
    }
  }
});

function escapeRegex(newprefix) {
  return newprefix?.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}


