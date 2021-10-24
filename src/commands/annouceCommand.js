/////////////////////// IMPORTS //////////////////////////
const sendError = require('../utils/error.js');
const { CEO_ID } = require('../utils/botUtils.js');
const guildData = require('../models/guildData.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

/////////////////////// SOURCE CODE //////////////////////////
module.exports = {
    name: "announce",
    description: "Faz um anúncio a todos os servidores em que o bot está",
    usage: [process.env.PREFIX_KEY + 'announce'],
    category: 'ceo',
    timeout: 7000,
    aliases: ['anc', 'msgall', 'msg'],

    async execute(client, message, args) {
        if (message.author.id != CEO_ID) return;

        const msg = args.join(" ") || args;
        if (!msg) return;

        const embed = new MessageEmbed()
            .setTitle("ANÚNCIO DOS DESENVOLVEDORES")
            .setDescription(`${msg}`)
            .setColor("#0f42dc")
            .setFooter("THE DRAGONS COMMUNITY TEAM • All RIGHTS RESERVED", "https://i.imgur.com/l59rO0X.gif")

        const button = new MessageButton()
            .setStyle("LINK")
            .setLabel("TDG COMMUNITY")
            .setURL("https://discord.gg/5QvAqkS7fy")

        const row = new MessageActionRow()
            .addComponents(button)

        const data = await guildData.find({});
        data.forEach(async function (c) {
            try {
                const guild = c.guildID;
                const channelSystem = client.guilds.cache.get(guild).channels.cache.get(guild.channels.systemChannelId);
                const channelUpdates = client.guilds.cache.get(guild).channels.cache.get(guild.channels.publicUpdatesChannelId);

                console.log(channelSystem)
                if (!channelUpdates && !channelSystem) return;
                if (channelUpdates) {
                    channelUpdates.send({ components: [row], embeds: [embed] }) && console.log("[CLIENT] ANÚNCIO ENVIADO")
                        .catch(e => console.log(e))
                    return;
                } else {
                    channelSystem.send({ components: [row], embeds: [embed] }) && console.log("[CLIENT] ANÚNCIO ENVIADO")
                        .catch(e => console.log(e))
                    return;
                }
            } catch (e) {
                console.log(e);
            }
        })
    }
}