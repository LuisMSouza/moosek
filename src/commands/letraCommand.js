/////////////////// IMPORTS ////////////////////////
const { MessageEmbed } = require('discord.js');
const sendError = require('../utils/error.js');
const Lyrics = require("song-lyrics-api");
const ytdl = require('ytdl-core');
const Client = new Lyrics()

////////////////// SOURCE CODE /////////////////////
module.exports = {
    name: "letra",
    description: "Para pegar a letra de uma música",
    usage: [process.env.PREFIX_KEY + 'letra [nome da música]'],
    category: 'user',
    timeout: 7000,
    aliases: ['lyrics', 'l'],

    async execute(client, message, args) {
        const emoji = client.guilds.cache.get("731542666277290016").emojis.cache.find(emj => emj.name === "7041_loading");
        const serverQueue = client.queue.get(message.guild.id);
        let main_entry = args.join(" ")
        let msge = await message.channel.send(`${emoji}`)

        if (!main_entry) {
            if (serverQueue) {
                try {
                    const search = await ytdl.getBasicInfo(serverQueue.songs[0].url)
                    console.log(search)
                    const songs = await Client.getLyrics(`${serverQueue.songs[0].title}`).then(async r => {
                        const lyrics = r[0].lyrics.lyrics
                        const title = r[0].title
                        const thumb = r[0].thumb
                        const artist = r[0].artist
                        await msge.delete(msge)
                        return generateEmbeds(message, lyrics, title, thumb, artist)
                    })
                } catch (e) {
                    await msge.delete(msge)
                    sendError(`Ocorreu um erro :(\n**${e}**`, message.channel)
                    console.log(e);
                }
            } else {
                return sendError("não há nenhuma música sendo reproduzida, pesquise pelo nome da música que deseja ;)", message.channel);
            }
        } else {
            try {
                const songs = await Client.getLyrics(`${main_entry}`).then(async r => {
                    const lyrics = r[0].lyrics.lyrics
                    const title = r[0].title
                    const thumb = r[0].thumb
                    const artist = r[0].artist
                    await msge.delete(msge)
                    return generateEmbeds(message, lyrics, title, thumb, artist)
                })
            } catch (e) {
                await msge.delete(msge)
                sendError(`Ocorreu um erro :(\n**${e}**`, message.channel)
                console.log(e);
            }
        }
        async function generateEmbeds(message, lyrics, title, thumb, artist) {
            let embed = new MessageEmbed()
                .setTitle(`${title} - ${artist}`)
                .setThumbnail(`${thumb}`)
                .setColor("#0f42dc")
            let embed2 = new MessageEmbed()
                .setColor("#0f42dc")
            let embed3 = new MessageEmbed()
                .setColor("#0f42dc")
            let embed4 = new MessageEmbed()
                .setColor("#0f42dc")

            embed.setDescription(lyrics);
            embed2.setDescription(lyrics);
            embed3.setDescription(lyrics);
            embed4.setDescription(lyrics);
            embed.setDescription(lyrics);

            if (embed.description.length > 2048 && embed.description.length <= 4090) {
                embed.description = `${embed.description.substr(0, 2045)}...`;
                await message.channel.send({ embeds: [embed] })
                embed2.description = `${lyrics.substr(2045)}`;
                if (embed2.description != "..." || embed2.description != "") {
                    await message.channel.send({ embeds: [embed2] })
                }
            } else if (embed.description.length > 4090) {
                embed.description = `${embed.description.substr(0, 2045)}...`;
                await message.channel.send({ embeds: [embed] })
                embed2.description = `${lyrics.substr(2045, 2045)}...`;
                await message.channel.send({ embeds: [embed2] })
                embed3.description = `${lyrics.substr(4090, 2045)}...`;
                if (embed3.description !== "...") {
                    await message.channel.send({ embeds: [embed3] })
                }
                embed4.description = `${lyrics.substr(6135, 2045)}...`;
                if (embed4.description !== "...") {
                    await message.channel.send({ embeds: [embed4] })
                }
            } else {
                await message.channel.send({ embeds: [embed] })
            }
        }
    }
}