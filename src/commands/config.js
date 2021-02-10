/////////////////////// IMPORTS //////////////////////////
const sendError = require('../utils/error.js');
const { MessageEmbed } = require('discord.js');
const guildData = require('../models/guildData.js');

/////////////////////// SOURCE CODE //////////////////////////
module.exports = {
    name: "config",
    description: "Configura o bot no servidor",
    usage: [process.env.PREFIX_KEY + 'config'],
    category: 'user',
    timeout: 7000,
    aliases: ['configurar'],

    async execute(client, message, args) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return sendError("Você não pode utilizar este comando nesse servidor", message.channel);
        var pref;
        const confs = await guildData.findOne({
            guildID: message.guild.id
        });
        pref = confs.guildPrefix

        var embed = new MessageEmbed()
            .setTitle(`${message.guild.name} | Configuração Moosek`)
            .setThumbnail(message.guild.iconURL())
            .addField(`> Prefixo`, `Prefixo do servidor: ` + "`" + `${pref}` + "`", true)
            .setFooter(client.user.username, client.user.displayAvatarURL())

        if (!args.length) return message.channel.send(embed);
        if (args[0].toLowerCase() != ("prefix" || "prefixo" || "pref")) return sendError(`Para modificar a configuração, utilize o comando da seguinte forma: \n` + "```css\n" + `${pref}config prefix\n` + "```", message.channel);

        if (args[0].toLowerCase() === ("prefix" || "prefixo" || "pref")) {
            const filter = m => m.author.id === message.author.id;
            var msg = await message.channel.send({ embed: { description: "**Digite o novo prefixo**" } });
            message.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
                .then(async collected => {
                    if (collected.first().content.length >= 5) return sendError("Esse prefixo é muito longo!", message.channel);
                    collected.first().content.toLowerCase();
                    await guildData.findOneAndUpdate({ guildID: message.guild.id }, { $set: { guildPrefix: collected.first().content.toLowerCase() } }, { new: true });
                    msg.delete(msg);
                    message.channel.send({
                        embed: {
                            description: "Prefixo alterado para: `" + `${collected.first().content.toLowerCase()}` + "`"
                        }
                    })
                }).catch(collected => message.channel.send("Tempo de resposta esgotado"))
        }
    }
}