/////////////////////// IMPORTS //////////////////////////
const Deezer = require('deezer-public-api');
const dzr = new Deezer();
const sendError = require('../utils/error.js');
const music_init = require('./createPlayer.js');
const YouTube = require("youtube-sr").default;
const { MessageEmbed } = require('discord.js');
const handleTracks = require('../structures/strDeezerTracks.js');
const { joinVoiceChannel } = require("@discordjs/voice");

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    async deezerHandler(client, message, search, cth, voiceChannel) {
        if (search.includes("/track/")) {
            dzr.track(`${cth}`).then(async res => {
                const serverQueue = message.client.queue.get(message.guild.id);
                try {
                    await YouTube.search(`${res.title} - ${res.artist.name} Official Audio`, { limit: 1 }).then(async x => {
                        const song = {
                            title: `${res.title} - ${res.artist.name}`,
                            url: x[0].url,
                            thumbnail: x[0].thumbnail.url,
                            duration: x[0].durationFormatted,
                            liveStream: x[0].live,
                            author: message.member.user.tag
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
                            if (playlist) return;
                            let thing = new MessageEmbed()
                                .setTitle(`> __Música adicionada à fila__`)
                                .setColor("GREEN")
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
                    for (const track of tracks) {
                        await handleTracks.handleVideo(client, track, message, voiceChannel, true);
                    }
                    return message.reply({
                        embeds: [{
                            color: "GREEN",
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
                    for (const track of tracks) {
                        await handleTracks.handleVideo(client, track, message, voiceChannel, true);
                    }
                    return message.reply({
                        embeds: [{
                            color: "GREEN",
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