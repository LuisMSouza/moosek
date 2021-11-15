/////////////////////// IMPORTS //////////////////////////
const sendError = require('../utils/error.js');
const { MessageEmbed } = require('discord.js');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "ajuda",
    description: "Exibe o menu de comandos do servidor",
    options: [
        {
            name: 'comando',
            type: 3, // 'STRING' Type
            description: 'Comando específico',
            required: false,
        }
    ],
    usage: [process.env.PREFIX_KEY + 'ajuda'],
    category: 'user',
    timeout: 7000,
    aliases: ['help', 'a', 'h'],

    async execute(client, message, args) {
        var query;
        if (message.options) {
            query = message.options.get('posição') ? message.options.get('posição').value : args[0];
            message.deferReply()
        }
        const sorted = client.commands.filter(c => c.category !== 'ceo');
        let cmds = "";
        sorted.forEach(cmd => {
            cmds += "``" + process.env.PREFIX_KEY + cmd.name + " `` -> " + cmd.description + "\n"
        })
        let embed = new MessageEmbed()
            .setTitle(`Comandos disponíveis`)
            .setColor("#2592b0")
            .setDescription(`Para mais informações sobre um comando -> **${process.env.PREFIX_KEY}help [commando]**\n\n${cmds}`)

        if (args[0] || query) {
            let cmd = args[0] || query
            let command = client.commands.get(cmd);
            if (!command) command = client.commands.find(x => x.aliases.includes(cmd))
            if (!command) return sendError("Comando desconhecido.", message.channel).then(m => m.delete({ timeout: 10000 }));

            let embedCommand = new MessageEmbed()
                .setTitle(command.name)
                .setColor("#2592b0")
                .setDescription(`
            **Descrição:** ${command.description}
            **Aliases:** ${command.aliases}
            **Como usar:** ${command.usage}
            `)

            return message.channel.send({ embeds: [embedCommand] });
        } else {
            return message.channel.send({ embeds: [embed] });
        }
    }
}