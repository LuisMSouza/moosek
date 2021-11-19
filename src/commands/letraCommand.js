/////////////////// IMPORTS ////////////////////////
const { MessageEmbed } = require('discord.js');
const sendError = require('../utils/error.js');
const Lyrics = require("yt-lirik");
const cLyrics = require("genius-lyrics");
const ytdl = require('ytdl-core');
const Genius = new cLyrics.Client(process.env.GENIUS_API_KEY);

////////////////// SOURCE CODE /////////////////////
module.exports = {
    name: "letra",
    description: "Para pegar a letra de uma música",
    options: [
        {
            name: 'music',
            type: 3, // 'STRING' Type
            description: 'Música para ser pesquisado a letra',
            required: false,
        }
    ],
    usage: [process.env.PREFIX_KEY + 'letra [nome da música]'],
    category: 'user',
    timeout: 7000,
    aliases: ['lyrics', 'l'],

    async execute(client, message, args) {
        var query;
        if (message.options) {
            query = message.options.get('music') ? message.options.get('music').value : args[0];
        }
        const emoji = client.guilds.cache.get("731542666277290016").emojis.cache.find(emj => emj.name === "7041_loading");
        const serverQueue = client.queue.get(message.guild.id);
        let main_entry = query || args.join(" ")
        let msge = await message.channel.send(`${emoji}`)

        if (!main_entry) {
            if (serverQueue) {
                try {
                    const search = await ytdl.getBasicInfo(serverQueue.songs[0].url)
                    const songs = await Genius.songs.search(`${search.videoDetails.media.song} ${search.videoDetails.media.artist}`).then(async r => {
                        return console.log(r[0])
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
                await msge.delete(msge)
                return sendError("não há nenhuma música sendo reproduzida, pesquise pelo nome da música que deseja ;)", message.channel);
            }
        } else {
            try {
                const songs = await Client.getLyrics(`${main_entry}`).then(async r => {
                    if (!r[0].lyrics || r[0].lyrics === undefined || r[0].title === 'None') {
                        await msge.delete(msge);
                        return sendError("Não foi possível encontrar a letra dessa música :(", message.channel)
                    }
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
                .setColor("#0184f8")
            let embed2 = new MessageEmbed()
                .setColor("#0184f8")
            let embed3 = new MessageEmbed()
                .setColor("#0184f8")
            let embed4 = new MessageEmbed()
                .setColor("#0184f8")

            embed.setDescription(lyrics);
            embed2.setDescription(lyrics);
            embed3.setDescription(lyrics);
            embed4.setDescription(lyrics);
            embed.setDescription(lyrics);

            if (embed.description.length > 2048 && embed.description.length <= 4090) {
                embed.description = `${embed.description.substr(0, 2045)}...`;
                await message.reply({ embeds: [embed] })
                embed2.description = `${lyrics.substr(2045)}`;
                if (embed2.description != "..." || embed2.description != "") {
                    await message.channel.send({ embeds: [embed2] })
                }
            } else if (embed.description.length > 4090) {
                embed.description = `${embed.description.substr(0, 2045)}...`;
                await message.reply({ embeds: [embed] })
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
                await message.reply({ embeds: [embed] })
            }
        }
    }
}