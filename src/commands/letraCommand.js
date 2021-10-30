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
        let main_entry = args.join(" ");
        let embed = new MessageEmbed()
            .setColor("#0f42dc")
        let embed2 = new MessageEmbed()
            .setColor("#0f42dc")
        let embed3 = new MessageEmbed()
            .setColor("#0f42dc")
        let embed4 = new MessageEmbed()
            .setColor("#0f42dc")
        let msge = await message.channel.send(`${emoji}`)

        if (!main_entry) {
            if (serverQueue) {
                try {
                    const songs = await Client.getLyrics(`${serverQueue.songs[0].title}`).then(r => {
                        return console.log(r);
                    })

                    embed.setDescription(lyrics);
                    embed2.setDescription(lyrics);
                    embed3.setDescription(lyrics);
                    embed4.setDescription(lyrics);
                    embed.setDescription(lyrics);
                    embed.setTitle(songs[0].fullTitle);
                    embed.setThumbnail(songs[0].thumbnail);
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
                    }
                    await msge.delete(msge)
                    //message.channel.send(embed)
                    return;
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
                const songs = await Client.getLyrics(`${main_entry}`).then(r => {
                    return console.log(r);
                })
                const lyrics = await songs[0].lyrics();

                embed.setDescription(lyrics)
                embed2.setDescription(lyrics)
                embed3.setDescription(lyrics)
                embed4.setDescription(lyrics)
                embed.setTitle(songs[0].title)
                embed.setThumbnail(songs[0].thumbnail)
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
                }
                await msge.delete(msge);
                return;
            } catch (e) {
                await msge.delete(msge)
                sendError(`Ocorreu um erro :(\n**${e}**`, message.channel)
                console.log(e);
            }
        }
    }
}