/////////////////////// IMPORTS //////////////////////////
const sendError = require('../utils/error.js');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
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

        if (!args.length) {
            const emb = new MessageEmbed()
                .setTitle(`${message.guild.name} | Configuração Moosek`)
                .setThumbnail(message.guild.iconURL())
                .setColor("#0f42dc")
                .addField(`> Prefixo`, `Prefixo atual do servidor: ` + "`" + `${pref}` + "`", true)
                .addField("> Como alterar?", `Basta digitar ` + "`" + `${pref}config prefix` + "` ou clicar no botão abaixo")
                .setFooter(client.user.username, client.user.displayAvatarURL())

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel("ALTERAR PREFIXO")
                        .setStyle("PRIMARY")
                        .setCustomId("prefix_button")
                )

            const embdd = new MessageEmbed()
                .setDescription("```fix\nDigite o novo prefixo\n```")

            const btnMsg = await message.channel.send({ components: [row], embeds: [emb] });
            try {
                const filter = (i) => i.user.id === message.author.id;
                const filter2 = m => m.author.id === message.author.id;
                const collector = btnMsg.channel.createMessageComponentCollector({ filter, max: 1 });
                collector.on('collect', i => {
                    i.update({ components: [], embeds: [embdd] });
                    message.channel.awaitMessages({ filter2, max: 1, time: 300_000, errors: ['time'] })
                        .then(async collected => {
                            if (collected.first().content.length >= 5) return sendError("Esse prefixo é muito longo!", message.channel) && embed.delete(embed);
                            collected.first().content.toLowerCase();
                            await guildData.findOneAndUpdate({ guildID: message.guild.id }, { $set: { guildPrefix: collected.first().content.toLowerCase() } }, { new: true });
                            embed.delete(embed);
                            const embed2 = new MessageEmbed()
                                .setDescription("Prefixo alterado para: `" + `${collected.first().content.toLowerCase()}` + "`")
                                .setColor("#0f42dc")
                            message.channel.send({ embeds: [embed2] });

                        }).catch(error => message.channel.send("Tempo de resposta esgotado"))
                    return;
                });
            } catch (e) {
                console.log(e);
            }

        } else {
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
                        let embdv = new MessageEmbed()
                            .setColor("Prefixo alterado para: `" + `${collected.first().content.toLowerCase()}` + "`")
                            .setDescription("#0f42dc")
                        message.channel.send({
                            embeds: [
                                embdv
                            ]
                        })
                    }).catch(collected => message.channel.send("Tempo de resposta esgotado"))
            }
        }
    }
}