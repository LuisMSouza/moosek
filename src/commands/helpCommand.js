/////////////////////// IMPORTS //////////////////////////
const sendError = require('../utils/error.js');
const { MessageEmbed } = require('discord.js');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "help",
    description: "Exibe o menu de comandos disponíveis para o bot",
    options: [
        {
            name: 'command',
            type: 3, // 'STRING' Type
            description: 'Comando específico',
            required: false,
        }
    ],
    usage: [process.env.PREFIX_KEY + 'ajuda'],
    category: 'user',
    timeout: 7000,
    aliases: ['ajuda', 'a', 'h'],

    async execute(client, message, args) {
        var query;
        try {
            if (args) {
                query = args.get('command') ? args.get('command').value : null || args.join(" ")
            }
        } catch (e) {
            if (e.message.includes("Cannot read properties of null (reading 'value')")) {
                query = null
            }
        }
        const sorted = client.commands.filter(c => c.category !== 'ceo');
        let cmds = "";
        sorted.forEach(cmd => {
            cmds += "``" + process.env.PREFIX_KEY + cmd.name + " `` -> " + cmd.description + "\n"
        })
        let embed = new MessageEmbed()
            .setTitle(`Comandos disponíveis`)
            .setColor("YELLOW")
            .setDescription(`Para mais informações sobre um comando -> **${process.env.PREFIX_KEY}help [commando]**\n\n${cmds}`)

        if (args[0] || query) {
            let cmd = args[0] || query
            let command = client.commands.get(cmd);
            if (!command) command = client.commands.find(x => x.aliases.includes(cmd))
            if (!command) return sendError("Comando desconhecido.", message.channel).then(m => m.delete({ timeout: 10000 }));

            let embedCommand = new MessageEmbed()
                .setTitle(command.name)
                .setColor("YELLOW")
                .setDescription(`
            **Descrição:** ${command.description}
            **Aliases:** ${command.aliases}
            **Como usar:** ${command.usage}
            `)

            return message.reply({ embeds: [embedCommand], ephemeral: true });
        } else {
            return message.reply({ embeds: [embed], ephemeral: true });
        }
    }
}