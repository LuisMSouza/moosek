/////////////////////// IMPORTS //////////////////////////
const ytlist = require('ytpl');;
const ytdl = require('ytdl-core');
const sendError = require('../utils/error.js')
const { QUEUE_LIMIT } = require('../utils/botUtils.js');
const YouTube = require("ytsr");
const music_init = require('../structures/strMusic.js');
const playlist_init = require('../structures/strPlaylist.js');
const sptfHandle = require('../structures/strSptfHandle.js');
const { deezerHandler } = require('../structures/strDeezerHandle.js');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');
const guild_main = process.env.SERVER_MAIN

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "play",
    description: "Para tocar músicas no servidor",
    usage: [process.env.PREFIX_KEY + 'play [nome da música / link da música / link da playlist]'],
    category: 'user',
    timeout: 3000,
    aliases: ['p', 'tocar', 'iniciar'],

    async execute(client, message, args) {
        const serverMain = client.guilds.cache.get(guild_main);
        const channelMain = serverMain.channels.cache.get("807738719556993064");
        const searchString = args.join(" ") || args;
        if (!searchString) return sendError("Você precisa digitar a música a ser tocada", message.channel);
        const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "" || searchString.replace(/<(.+)>/g, "$1") || searchString;
        if (!searchString || !url) return sendError(`Como usar: .p <Link da música ou playlist | Nome da música>`, message.channel);
        const serverQueue = client.queue.get(message.guild.id);

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return sendError("Você precisa estar em um canal de voz para iniciar uma música!", message.channel);

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) return sendError("Eu não teho permissões para conectar nesse canal :(", message.channel).then(m2 => m2.delete({ timeout: 10000 }));
        if (!permissions.has("SPEAK")) return sendError("Eu não teho permissões para falar nesse canal :(", message.channel).then(m3 => m3.delete({ timeout: 10000 }));

        const playlistRegex = /^http(s)?:\/\/(www\.)?youtube.com\/.+list=.+$/
        const sptfRegex = /((open|play)\.spotify\.com\/)/;
        const deezerRegex = /^(http(s)?:\/\/)?(www\.)?deezer\.(com|page\.link)\/(.{2}\/)?(playlist\/|track\/|album\/|artist\/)?(.[0-9]+)?(.+)?$/
        var isDeezer = deezerRegex.test(url);
        isPlaylist = playlistRegex.test(url);
        var isSptf = sptfRegex.test(url);

        const radioListen = client.radio.get(message.guild.id);
        if (radioListen) return sendError("Você deve parar a radio primeiro.", message.channel);

        if (isDeezer) {
            const cth = await url.match(deezerRegex)[7]
            await deezerHandler(client, message, searchString, cth, voiceChannel);
            return;
        }

        if (isSptf) {
            const regEx = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:(album|track|playlist)\/|\?uri=spotify:track:)((\w|-){22})/;
            const spotifySymbolRegex = /spotify:(?:(album|track|playlist):|\?uri=spotify:track:)((\w|-){22})/;
            const cath = url.match(regEx) || url.match(spotifySymbolRegex) || [];
            await sptfHandle.handleSpotifyMusic(client, searchString, cath, message, voiceChannel);
            return;
        }

        if (isPlaylist) {
            try {
                if (serverQueue) {
                    if (serverQueue.songs.length > Math.floor(QUEUE_LIMIT - 1) && QUEUE_LIMIT !== 0) {
                        return sendError(`Você não pode adicionar mais de **${QUEUE_LIMIT}** músicas na fila.`, message.channel);
                    }
                }
                const playlist = await ytlist(`${url.match(playlistRegex)}`)
                if (!playlist) return sendError("Playlist não encontrada", message.channel)
                const videos = await playlist.items;
                for (const video of videos) {
                    await playlist_init.handleVideo(client, video, message, voiceChannel, true);
                }
                return message.channel.send({
                    embed: {
                        color: "GREEN",
                        description: `**Playlist adicionada à fila**`,
                        fields: [
                            {
                                name: "> __Pedido por:__",
                                value: "```fix\n" + `${message.author.tag}` + "\n```",
                                inline: true
                            }
                        ]
                    }
                });
            } catch {
                try {
                    console.log("ENTRY3")
                    if (serverQueue) {
                        if (serverQueue.songs.length > Math.floor(QUEUE_LIMIT - 1) && QUEUE_LIMIT !== 0) {
                            return sendError(`Você não pode adicionar mais de **${QUEUE_LIMIT}** músicas na fila.`, message.channel);
                        }
                    }
                    var searched = await ytlist(searchString)
                    if (searched.length === 0) return sendError("Eu não consegui achar essa playlist :(", message.channel)
                    const videos = await searched.items;
                    for (const video of videos) {
                        await playlist_init.handleVideo(client, video, message, voiceChannel, true);
                    }
                    return message.channel.send({
                        embed: {
                            color: "GREEN",
                            description: `**Playlist adicionada à fila**`,
                            fields: [
                                {
                                    name: "> __Pedido por:__",
                                    value: "```fix\n" + `${message.author.tag}` + "\n```",
                                    inline: true
                                }
                            ]
                        }
                    });
                } catch (error) {
                    console.log(error);
                    channelMain.send({
                        embed: {
                            title: "Erro na source",
                            description: "*Detalhes do erro:*\n```fix\n" + `${error}` + "\n```"
                        }
                    });
                }
            }
        } else {
            console.log("Entry 1")
            try {
                await YouTube(searchString, { limit: 1 }).then(async x => {
                    const song = {
                        title: x.items[0].title ? x.items[0].title : ytdl.getBasicInfo(x.items[0].url).videoDetails.media.song,
                        url: x.items[0].url,
                        thumbnail: x.items[0].bestThumbnail.url,
                        duration: x.items[0].duration,
                        liveStream: x.items[0].isLive,
                        author: message.author.tag
                    }

                    if (!serverQueue && AudioPlayerStatus.Idle) {
                        console.log("ENTRY 2")
                        const queueConstruct = {
                            textChannel: message.channel,
                            voiceChannel: voiceChannel,
                            connection: null,
                            songs: [],
                            prevSongs: [],
                            volume: 5,
                            bass: 1,
                            nigthCore: false,
                            playing: true,
                            looping: false,
                            songLooping: false
                        }
                        client.queue.set(message.guild.id, queueConstruct)
                        queueConstruct.songs.push(song)
                        console.log(serverQueue)

                        try {
                            return music_init.play(client, message, queueConstruct.songs[0]);
                        } catch (err) {
                            console.log(err);
                            client.queue.delete(message.guild.id);
                            channelMain.send({
                                embed: {
                                    title: "Erro na source",
                                    description: "*Detalhes do erro:*\n```fix\n" + `${err}` + "\n```"
                                }
                            });
                            return;
                        }
                    } else if (AudioPlayerStatus.Playing && serverQueue) {
                        console.log("ENTRY 3")
                        if (serverQueue.songs.length > Math.floor(QUEUE_LIMIT - 1) && QUEUE_LIMIT !== 0) {
                            return sendError(`Você não pode adicionar mais de **${QUEUE_LIMIT}** músicas na fila.`, message.channel);
                        }
                        serverQueue.songs.push(song);
                        return message.channel.send({
                            embeds: [{
                                color: "GREEN",
                                title: "Adicionado à fila",
                                description: `[${song.title}](${song.url}) adicionado à fila`,
                                fields: [
                                    {
                                        name: "> __Duração:__",
                                        value: "```fix\n" + `${song.duration}` + "\n```",
                                        inline: true
                                    },
                                    {
                                        name: "> __Pedido por:__",
                                        value: "```fix\n" + `${message.author.tag}` + "\n```",
                                        inline: true
                                    }
                                ]
                            }]
                        })
                    }
                })
            } catch (err) {
                if (err.message.includes("Cannot read property 'title' of undefined")) {
                    console.log(`[VIDEO UNAVAILABLE] ${searchString}`)
                    await sendError("**Este vídeo está indisponível.**", message.channel);
                    return;
                }
                console.log(err);
                channelMain.send({
                    embed: {
                        title: "Erro na source",
                        description: "*Detalhes do erro:*\n```fix\n" + `${err}` + "\n```"
                    }
                });
                return;
            }
            return undefined;
        }
    }
};