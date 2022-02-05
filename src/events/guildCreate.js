/////////////////////// IMPORTS //////////////////////////
import createGuild from '../models/createGuild.js';
import { MessageEmbed } from 'discord.js';

/////////////////////// SOURCE CODE //////////////////////////
export default async (client, guild) => {
    try {
        const embed_1 = new MessageEmbed()
            .setTitle("Obrigado por me adicionar!")
            .addField(`❔ Como usar?`, `Para ober mais informações sobre os comandos do bot, basta digitar: **${process.env.PREFIX_KEY}ajuda**\nLogo em seguida, você receberá uma mensagem contendo os comandos disponíveis.`)
            .setTimestamp()
            .setColor("YELLOW")

        if (guild.publicUpdatesChannel) {
            guild.publicUpdatesChannel.send({ embeds: [embed_1] });
        }

        const embed_2 = new MessageEmbed()
            .setTitle("Novo servidor!")
            .setDescription("```css\nNOME: " + `${guild.name}` + "\nID: " + `(${guild.id})` + "\nCEO ID: " + `${guild.ownerId}` + "\nMEMBROS: " + `${guild.memberCount}` + "\nREGIÃO: " + `${guild.region}` + "\nV-LEVEL: " + `${guild.verificationLevel}` + "\n```")
            .setTimestamp()
            .setFooter(`Atualmente em ${client.guilds.cache.size} servidores`)
            .setThumbnail(guild.iconURL())
            .setColor("YELLOW")

        client.channels.cache.get("807738719556993064").send({ embeds: [embed_2] });
        await createGuild(guild.id);
    } catch (e) {
        console.log(e);
    }
}