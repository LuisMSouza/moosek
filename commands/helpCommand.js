/////////////////////// IMPORTS //////////////////////////
const sendError = require("../utils/error.js");
const { EmbedBuilder, ApplicationCommandOptionType, Colors } = require("discord.js");

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
  name: "help",
  description: "Exibe o menu de comandos disponíveis para o bot",
  options: [
    {
      name: "command",
      type: ApplicationCommandOptionType.String, // 'STRING' Type
      description: "Comando específico",
      required: false,
    },
  ],
  usage: [process.env.PREFIX_KEY + "ajuda"],
  category: "user",
  timeout: 7000,
  aliases: ["ajuda", "a", "h"],

  async execute(client, message, args) {
    var query;
    try {
      if (args) {
        query = args.get("command")
          ? args.get("command").value
          : null || args.join(" ");
      }
    } catch (e) {
      if (
        e.message.includes("Cannot read properties of null (reading 'value')")
      ) {
        query = null;
      }
    }
    const sorted = client.commands.filter((c) => c.category !== "ceo");
    let cmds = "";
    sorted.forEach((cmd) => {
      cmds +=
        "``" +
        process.env.PREFIX_KEY +
        cmd.name +
        " `` -> " +
        cmd.description +
        "\n";
    });
    let embed = new EmbedBuilder()
      .setTitle(`Comandos disponíveis`)
      .setColor(Colors.Yellow)
      .setDescription(
        "```\n" + `Para mais informações sobre um comando -> ${process.env.PREFIX_KEY}help [commando]` + "\n```" + `\n${cmds}`
      );

    if (args[0] || query) {
      let cmd = args[0] || query;
      let command = client.commands.get(cmd);
      if (!command)
        command = client.commands.find((x) => x.aliases.includes(cmd));
      if (!command)
        return message.reply({
          embeds: [
            {
              color: Colors.Red,
              description: "```\n" + `❌ - Comando desconhecido.` + "\n```"
            },
          ],
          ephemeral: true
        })

      let embedCommand = new EmbedBuilder()
        .setTitle(`Comando - ${command.name}`)
        .setColor(Colors.Yellow)
        .addFields(
          { name: "> __**Descrição:**__", value: "```\n" + `${command.description}` + "\n```", inline: true },
          { name: "> __**Aliases:**__", value: "```\n" + `${command.aliases}` + "\n```", inline: true },
          { name: "> __**Como usar:**__", value: "```\n" + `${command.usage}` + "\n```", inline: true }
        )

      return message.reply({ embeds: [embedCommand], ephemeral: true });
    } else {
      return message.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
