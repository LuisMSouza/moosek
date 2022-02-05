/////////////////////// IMPORTS //////////////////////////
const Deezer = require('deezer-public-api');
const dzr = new Deezer();
const sendError = require('../utils/error.js');
const music_init = require('./createPlayer.js');
const dl = require("play-dl");
const { MessageEmbed } = require('discord.js');
const handleTracks = require('../structures/strDeezerTracks.js');
const { joinVoiceChannel } = require("@discordjs/voice");

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    async deezerHandler(client, message, search, cth, voiceChannel) {
        const emoji = client.guilds.cache.get("731542666277290016").emojis.cache.find(emj => emj.name === "7041_loading");
        if (search.includes("/track/")) {
            dzr.track(`${cth}`).then(async res => {
                const serverQueue = message.client.queue.get(message.guild.id);
                try {
                    await dl.search(`${res.title} - ${res.artist.name} Official Audio`, { limit: 1 }).then(async x => {
                        const song = {
                            title: x[0].title,
                            url: x[0].url,
                            thumbnail: x[0].thumbnail.url,
                            duration: x[0].durationRaw,
                            liveStream: x[0].live,
                            author: message.member.user.tag,
                            embed: {
                                author: "Tocando agora:",
                                color: "YELLOW",
                                title: `${x[0].title}`,
                                thumbnail: {
                                    "url": `${x[0].thumbnails[0].url}`,
                                },
                                fields: [
                                    {
                                        "name": "> __Duração:__",
                                        "value": "```fix\n" + `${x[0].live ? "🔴 Live" : x[0].durationRaw}` + "\n```",
                                        "inline": true
                                    },
                                    {
                                        "name": "> __Canal:__",
                                        "value": "```fix\n" + `${voiceChannel.name}` + "\n```",
                                        "inline": true
                                    },
                                    {
                                        "name": "> __Pedido por:___",
                                        "value": "```fix\n" + `${message.member.user.tag}` + "\n```",
                                        "inline": true
                                    },
                                ]
                            }
                        }
                        if (!serverQueue) {
                            const queueConstruct = {
                                textChannel: message.channel,
                                voiceChannel: channel,
                                connection: null,
                                audioPlayer: null,
                                resource: null,
                                songs: [],
                                prevSongs: [],
                                volume: 100,
                                nigthCore: false,
                                playing: true,
                                looping: false,
                                songLooping: false
                            }
                            message.client.queue.set(message.guild.id, queueConstruct);
                            queueConstruct.songs.push(song);

                            try {
                                const connection = joinVoiceChannel({
                                    guildId: message.guild.id,
                                    channelId: channel.id,
                                    adapterCreator: message.guild.voiceAdapterCreator
                                });
                                queueConstruct.connection = connection;
                                music_init.play(client, message, queueConstruct.songs[0]);
                            } catch (error) {
                                console.error(`Eu não consegui entrar no canal: ${error}`);
                                message.client.queue.delete(message.guild.id);
                                return sendError(`Eu não consegui entrar no canal: ${error}`, message.channel);

                            }
                        } else {
                            serverQueue.songs.push(song);
                            let thing = new MessageEmbed()
                                .setTitle(`> __Música adicionada à fila__`)
                                .setColor("YELLOW")
                                .setThumbnail(song.img)
                                .setDescription(`[${song.title}](${song.url}) adicionado à fila`)
                                .addField("> __Duração:__", "```fix\n" + `${song.duration}` + "\n```", true)
                                .addField("> __Pedido por:__", "```fix\n" + `${message.author.tag}` + "\n```", true)
                            return serverQueue.textChannel.send({ embeds: [thing] });
                        }
                        return;
                    })
                } catch (e) {
                    return console.log(e);
                }
            })
        } else if (search.includes("/playlist/")) {
            dzr.playlist(`${cth}`).then(async res2 => {
                try {
                    const tracks = await res2.tracks.data
                    const msg = await message.channel.send(`${emoji} Adicionando músicas...`);
                    for (const track of tracks) {
                        await handleTracks.handleVideo(client, track, message, voiceChannel, true);
                    }
                    await msg.delete(msg);
                    return message.reply({
                        embeds: [{
                            color: "YELLOW",
                            description: `**Playlist adicionada à fila**`,
                            fields: [
                                {
                                    name: "> __Pedido por:__",
                                    value: "```fix\n" + `${message.author.tag}` + "\n```",
                                    inline: true
                                },
                                {
                                    name: "> __Total de músicas:__",
                                    value: "```fix\n" + `${tracks.length}` + "\n```",
                                    inline: true
                                }
                            ]
                        }]
                    });
                } catch (e) {
                    return console.log(e);
                }
            })
        } else if (search.includes("/album/")) {
            dzr.album(`${cth}`).then(async res3 => {
                try {
                    const tracks = await res3.tracks.data
                    const msg = await message.channel.send(`${emoji} Adicionando músicas...`);
                    for (const track of tracks) {
                        await handleTracks.handleVideo(client, track, message, voiceChannel, true);
                    }
                    await msg.delete(msg);
                    return message.reply({
                        embeds: [{
                            color: "YELLOW",
                            description: `**Album adicionada à fila**`,
                            fields: [
                                {
                                    name: "> __Pedido por:__",
                                    value: "```fix\n" + `${message.author.tag}` + "\n```",
                                    inline: true
                                },
                                {
                                    name: "> __Total de músicas:__",
                                    value: "```fix\n" + `${tracks.length}` + "\n```",
                                    inline: true
                                }
                            ]
                        }]
                    });
                } catch (e) {
                    return console.log(e);
                }
            }, async function (err) {
                console.log(err);
            })
        }
    }
}