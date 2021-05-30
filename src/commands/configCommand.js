/////////////////////// IMPORTS //////////////////////////
const sendError = require('../utils/error.js');
const { MessageEmbed } = require('discord.js');
const guildData = require('../models/guildData.js');
const { MessageButton } = require('discord-buttons');

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

        if (!args.length) {
            const emb = new MessageEmbed()
                .setTitle(`${message.guild.name} | Configuração Moosek`)
                .setThumbnail(message.guild.iconURL())
                .setColor("#701AAB")
                .addField(`> Prefixo`, `Prefixo atual do servidor: ` + "`" + `${pref}` + "`", true)
                .addField("> Como alterar?", `Basta digitar ` + "`" + `${pref}config prefix` + "` ou clicar no botão abaixo")
                .setFooter(client.user.username, client.user.displayAvatarURL())

            const btn = new MessageButton()
                .setID("prefix_altern")
                .setLabel("ALTERAR PREFIXO")
                .setStyle("blurple")

            const embd = new MessageEmbed()
                .setDescription("```fix\nDigite o novo prefixo\n```")

            const btnMsg = await message.channel.send({ buttons: [btn], embed: emb });
            const filter = (button) => button.clicker.user.id != client.user.id;
            const colletcButt = btnMsg.createButtonCollector(filter);
            colletcButt.on("collect", async (b) => {
                btn.setDisabled()
                btnMsg.edit({ buttons: [btn], embed: embd });
                const filter2 = m => m.author.id === message.author.id;
                message.channel.awaitMessages(filter2, { max: 1, time: 300000, errors: ['time'] })
                    .then(async collected => {
                        if (collected.first().content.length >= 5) return sendError("Esse prefixo é muito longo!", message.channel);
                        collected.first().content.toLowerCase();
                        await guildData.findOneAndUpdate({ guildID: message.guild.id }, { $set: { guildPrefix: collected.first().content.toLowerCase() } }, { new: true });
                        btnMsg.delete(btnMsg);
                        message.channel.send({
                            embed: {
                                description: "Prefixo alterado para: `" + `${collected.first().content.toLowerCase()}` + "`"
                            }
                        })
                    }).catch(collected => message.channel.send("Tempo de resposta esgotado"))
            })
        }

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