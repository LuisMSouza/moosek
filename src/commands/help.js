/////////////////////// IMPORTS //////////////////////////
const sendError = require('../utils/error.js');
const { MessageEmbed } = require('discord.js');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "ajuda",
    description: "Exibe o menu de comandos do servidor",
    usage: [process.env.PREFIX_KEY + 'ajuda'],
    category: 'user',
    timeout: 7000,
    aliases: ['help', 'a', 'h'],

    async execute(client, message, args) {
        const sorted = client.commands.filter(c => c.category !== 'ceo');
        let cmds = "";
        sorted.forEach(cmd => {
            cmds += "``" + process.env.PREFIX_KEY + cmd.name + " `` -> " + cmd.description + "\n"
        })
        let embed = new MessageEmbed()
            .setTitle(`Comandos disponíveis`)
            .setDescription(`Para mais informações sobre um comando -> **${process.env.PREFIX_KEY}help [commando]**\n\n${cmds}`)

        if (args[0]) {
            let cmd = args[0]
            let command = client.commands.get(cmd);
            if (!command) command = client.commands.find(x => x.aliases.includes(cmd))
            if (!command) return sendError("Comando desconhecido.", message.channel).then(m => m.delete({ timeout: 10000 }));
            
            let embedCommand = new MessageEmbed()
            .setTitle(command.name)
            .setDescription(`
            **Descrição:** ${command.description}
            **Aliases:** ${command.aliases}
            **Como usar:** ${command.usage}
            `)

            return message.channel.send(embedCommand);
        } else {
            return message.channel.send(embed);
        }
    }
}