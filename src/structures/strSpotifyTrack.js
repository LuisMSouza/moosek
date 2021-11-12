/////////////////////// IMPORTS //////////////////////////
const { MessageEmbed } = require('discord.js');
const sendError = require('../utils/error.js');
const music_init = require('./createPlayer.js');
const YouTube = require("youtube-sr").default;
const { joinVoiceChannel } = require("@discordjs/voice");

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    async handleVideo(client, track, message, channel) {
        const serverQueue = message.client.queue.get(message.guild.id);
        try {
            await YouTube.search(`${track.name} - ${track.artists[0].name} Official Audio`, { limit: 1 }).then(async x => {
                const song = {
                    title: `${track.name} - ${track.artists[0].name}`,
                    url: x[0].url,
                    thumbnail: x[0].thumbnail.url,
                    duration: x[0].durationFormatted,
                    liveStream: x[0].live,
                    author: message.member.user.tag,
                    embed: {
                        author: "Tocando agora:",
                        color: "#2592b0",
                        title: `${res.title} - ${res.artist.name}`,
                        thumbnail: {
                            "url": `${x[0].thumbnail.url}`,
                        },
                        url: `${x[0].url}`,
                        fields: [
                            {
                                "name": "> __Duração:__",
                                "value": "```fix\n" + `${x[0].durationFormatted}` + "\n```",
                                "inline": true
                            },
                            {
                                "name": "> __Canal:__",
                                "value": "```fix\n" + `${channel.name}` + "\n```",
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
    }
}