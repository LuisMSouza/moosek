/////////////////////// IMPORTS //////////////////////////
const ytlist = require('ytpl');;
const ytdl = require('ytdl-core');
const dl = require('play-dl');
const sendError = require('../utils/error.js')
const { QUEUE_LIMIT } = require('../utils/botUtils.js');
const YouTube = require("youtube-sr").default;
const { play } = require('../structures/createPlayer.js');
const playlist_init = require('../structures/strPlaylist.js');
const sptfHandle = require('../structures/strSptfHandle.js');
const { deezerHandler } = require('../structures/strDeezerHandle.js');
const { createAudioPlayer, createAudioResource, StreamType, demuxProbe, joinVoiceChannel, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice')
const guild_main = process.env.SERVER_MAIN;

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "play",
    description: "Para tocar músicas no servidor",
    options: [
        {
            name: 'music',
            type: 3, // 'STRING' Type
            description: 'Nome ou link da música',
            required: true,
        }
    ],
    usage: [process.env.PREFIX_KEY + 'play [nome da música / link da música / link da playlist]'],
    category: 'user',
    timeout: 3000,
    aliases: ['p', 'tocar', 'iniciar'],

    async execute(client, message, args) {
        var query;
        if (message.options) {
            query = message.options.get('music') ? message.options.get('music').value : args[0];
        }
        const serverMain = client.guilds.cache.get(guild_main);
        const channelMain = serverMain.channels.cache.get("807738719556993064");
        const searchString = query || args.join(" ");
        if (!searchString) return sendError("Você precisa digitar a música a ser tocada", message.channel);
        const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "" || searchString || query;
        if (!searchString || !url) return sendError(`Como usar: .p <Link da música ou playlist | Nome da música>`, message.channel);

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return sendError("Você precisa estar em um canal de voz para iniciar uma música!", message.channel);

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) return sendError("Eu não teho permissões para conectar nesse canal :(", message.channel)
        if (!permissions.has("SPEAK")) return sendError("Eu não teho permissões para falar nesse canal :(", message.channel)

        const playlistRegex = /^http(s)?:\/\/(www\.)?youtube.com\/.+list=.+$/
        const sptfRegex = /((open|play)\.spotify\.com\/)/;
        const deezerRegex = /^(http(s)?:\/\/)?(www\.)?deezer\.(com|page\.link)\/(.{2}\/)?(playlist\/|track\/|album\/|artist\/)?(.[0-9]+)?(.+)?$/
        const soundCloudRegex = /^(?:(https?):\/\/)?(?:(?:www|m)\.)?(soundcloud\.com|snd\.sc)\/(.*)$/

        var isSoundCloud = soundCloudRegex.test(url);
        var isDeezer = deezerRegex.test(url);
        var isPlaylist = playlistRegex.test(url);
        var isSptf = sptfRegex.test(url);

        const radioListen = client.radio.get(message.guild.id);
        const serverQueue = message.client.queue.get(message.guild.id);
        if (radioListen) return sendError("Você deve parar a radio primeiro.", message.channel);

        if (isSoundCloud) {
            try {
                if (url.includes("/sets/")) {
                    dl.SoundCloudPlaylist(url).then(res => {
                        console.log(res);
                    });
                } else {
                    dl.SoundCloudTrack(url).then(res => {
                        console.log(res);
                    });
                }
            } catch (e) {

            }
        }

        if (isDeezer) {
            const cth = await url.match(deezerRegex)[7]
            await deezerHandler(client, message, searchString, cth, voiceChannel);
            if (message.options) {
                message.reply(`🔎 Aguardando busca Deezer...`)
            }
            return;
        }

        if (isSptf) {
            const regEx = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:(album|track|playlist)\/|\?uri=spotify:track:)((\w|-){22})/;
            const spotifySymbolRegex = /spotify:(?:(album|track|playlist):|\?uri=spotify:track:)((\w|-){22})/;
            const cath = url.match(regEx) || url.match(spotifySymbolRegex) || [];
            await sptfHandle.handleSpotifyMusic(client, searchString, cath, message, voiceChannel);
            if (message.options) {
                message.reply(`🔎 Aguardando busca Spotify...`)
            }
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
                return message.reply({
                    embeds: [{
                        color: "YELLOW",
                        description: `**Playlist adicionada à fila**`,
                        fields: [
                            {
                                name: "> __Pedido por:__",
                                value: "```fix\n" + `${message.member.user.tag}` + "\n```",
                                inline: true
                            },
                            {
                                name: "> __Total de músicas:__",
                                value: "```fix\n" + `${videos.length}` + "\n```",
                                inline: true
                            }
                        ]
                    }]
                });
            } catch {
                try {
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
                    return message.reply({
                        embeds: [{
                            color: "YELLOW",
                            description: `**Playlist adicionada à fila**`,
                            fields: [
                                {
                                    name: "> __Pedido por:__",
                                    value: "```fix\n" + `${message.member.user.tag}` + "\n```",
                                    inline: true
                                },
                                {
                                    name: "> __Total de músicas:__",
                                    value: "```fix\n" + `${videos.length}` + "\n```",
                                    inline: true
                                }
                            ]
                        }]
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
            try {
                await dl.search(`${searchString}`, { limit: 1 }).then(async x => {
                    const queueConstruct = {
                        textChannel: message.channel,
                        voiceChannel: voiceChannel,
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
                                "url": `${x[0].thumbnail.url}`,
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


                    if (serverQueue) {
                        if (message.guild.me.voice.channel.id !== voiceChannel.id) return sendError("Ops :(\nParece que você não está no mesmo canal que eu...", serverQueue.textChannel);
                        serverQueue.songs.push(song);
                        message.reply({
                            embeds: [{
                                color: "YELLOW",
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
                                        value: "```fix\n" + `${message.member.user.tag}` + "\n```",
                                        inline: true
                                    }
                                ]
                            }]
                        })
                            .catch(console.error);
                        return;
                    } else {
                        queueConstruct.songs.push(song);
                        message.reply({
                            embeds: [{
                                color: "YELLOW",
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
                                        value: "```fix\n" + `${message.member.user.tag}` + "\n```",
                                        inline: true
                                    }
                                ]
                            }]
                        })
                        await message.client.queue.set(message.guild.id, queueConstruct);
                        try {
                            const connection = await joinVoiceChannel({
                                guildId: message.guild.id,
                                channelId: voiceChannel.id,
                                adapterCreator: message.guild.voiceAdapterCreator
                            });
                            queueConstruct.connection = connection;
                            play(client, message, queueConstruct.songs[0]);
                        } catch (error) {
                            console.log(error);
                            connection.destroy();
                            client.queue.delete(message.guild.id);
                            return sendError("**Ops :(**\n\nAlgo de errado não está certo... Tente novamente", message.channel);
                        }
                    }
                });
            } catch (err) {
                if (err.message.includes("Cannot read properties of undefined (reading 'title')")) {
                    console.log(`[VIDEO UNAVAILABLE] ${searchString}`)
                    await sendError("**Este vídeo está indisponível.**", message.channel);
                    return;
                }
                console.log(err);
                channelMain.send({
                    embeds: [{
                        title: "Erro na source",
                        description: "*Detalhes do erro:*\n```fix\n" + `${err}` + "\n```"
                    }]
                });
                return;
            }
        }
    }
};