/////////////////////// IMPORTS //////////////////////////
const createGuild = require('../models/createGuild.js');
const { MessageEmbed } = require('discord.js');

/////////////////////// SOURCE CODE //////////////////////////
module.exports = async (client, guild) => {
    try {
        var emoji = client.guilds.cache.get("731542666277290016").emojis.cache.find(emoji => emoji.name === "3224_info");

        const embed_1 = new MessageEmbed()
            .setTitle("Obrigado por me adicionar!")
            .addField(`${emoji} Como usar?`, `Para ober mais informações sobre os comandos do bot, basta digitar: **${process.env.PREFIX_KEY}ajuda**\nLogo em seguida, você receberá uma mensagem contendo os comandos disponíveis.`)
            .setTimestamp()
            .setColor("#0f42dc")

        if (guild.publicUpdatesChannel) {
            guild.publicUpdatesChannel.send({ embeds: [embed_1] });
        }

        const embed_2 = new MessageEmbed()
            .setTitle("Novo servidor!")
            .setDescription("```css\nNOME: " + `${guild.name}` + "\nID: " + `(${guild.id})` + "\nCEO: " + `${guild.owner.user.tag} | (${guild.owner.user.id})` + "\nMEMBROS: " + `${guild.memberCount}` + "\nREGIÃO: " + `${guild.region}` + "\nV-LEVEL: " + `${guild.verificationLevel}` + "\n```")
            .setTimestamp()
            .setFooter(`Atualmente em ${client.guilds.cache.size} servidores`)
            .setThumbnail(guild.iconURL())
            .setColor("#0f42dc")

        client.channels.cache.get("807738719556993064").send({ embeds: [embed_2] });
        await createGuild(guild.id);
    } catch (e) {
        console.log(e);
    }
}