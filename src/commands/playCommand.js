/////////////////////// IMPORTS //////////////////////////
const ytlist = require('ytpl');;
const ytdl = require('ytdl-core');
const sendError = require('../utils/error.js')
const { QUEUE_LIMIT } = require('../utils/botUtils.js');
const YouTube = require("youtube-sr").default;
const music_init = require('../structures/strMusic.js');
const playlist_init = require('../structures/strPlaylist.js');
const SpotifyWebApi = require('spotify-web-api-node');
const handleSpotify = require('../structures/strSpotifyPlaylist.js');
const handleSpotify2 = require('../structures/strSpotifyAlbum.js');
const handleSpotify3 = require('../structures/strSpotifyTrack.js');
const SptfToken = require('../models/TokenAcess.json');
const fs = require('fs');

const spotifyApi = new SpotifyWebApi({
    clientId: "9e88800cff1e43fc95e0c6bd421e0976",
    clientSecret: "a2d2b6951bec462ea6053754c51df3ad"
});
spotifyApi.setAccessToken(SptfToken.SpotifyAcessToken);
spotifyApi.setRefreshToken(process.env.SPOTIFY_KEY_REFRESH);

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "play",
    description: "Para tocar músicas no servidor",
    usage: [process.env.PREFIX_KEY + 'play [nome da música / link da música / link da playlist]'],
    category: 'user',
    timeout: 3000,
    aliases: ['p', 'tocar', 'iniciar'],

    async execute(client, message, args) {
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
        isPlaylist = playlistRegex.test(url);
        var isSptf = sptfRegex.test(url);

        const radioListen = client.radio.get(message.guild.id);
        if (radioListen) return sendError("Você deve parar a radio primeiro.", message.channel);

        if (isSptf) {
            const regEx = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:(album|track|playlist)\/|\?uri=spotify:track:)((\w|-){22})/;
            const spotifySymbolRegex = /spotify:(?:(album|track|playlist):|\?uri=spotify:track:)((\w|-){22})/;
            var cath = url.match(regEx) || url.match(spotifySymbolRegex) || [];
            if (searchString.includes("open.spotify.com/playlist")) {
                spotifyApi.getPlaylist(cath[2])
                    .then(async function (data) {
                        const tracks = await data.body.tracks.items;
                        console.log(tracks[1].added_by.images[0]);
                        for (const track of tracks) {
                            await handleSpotify.handleVideo(track, message, voiceChannel, true);
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
                    }, async function (err) {
                        if (err.message.includes("Invalid playlist Id.")) {
                            sendError("Id da playlist inválido.", message.channel);
                            return;
                        }
                        if (err.message.includes("The access token expired.")) {
                            spotifyApi.refreshAccessToken().then(
                                async function (data3) {
                                    console.log('The access token has been refreshed!');
                                    await spotifyApi.setAccessToken(data3.body['access_token']);
                                    var json = JSON.stringify(data3.body['access_token']);
                                    await fs.writeFile('./TokenAcess.json', json, function (err) {
                                        if (err) return console.log(err);
                                    });
                                    spotifyApi.getPlaylist(cath[2])
                                        .then(async function (data2) {
                                            const tracks = await data2.body.tracks.items;
                                            for (const track of tracks) {
                                                await handleSpotify.handleVideo(track, message, voiceChannel, true);
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
                                        });
                                },
                                function (err) {
                                    console.log('Could not refresh access token', err);
                                    return sendError("Não foi possível reproduzir esta playlist :(", message.channel);
                                }
                            );
                        }
                        console.log(err.message);
                        return;
                    });
            } else if (searchString.includes("open.spotify.com/track")) {
                spotifyApi.searchTracks(`id:${cath[2]}`)
                    .then(async function (data4) {
                        console.log('Search: "', data4.body);
                    }, function (err) {
                        console.error(err);
                    });
            } else if (searchString.includes("open.spotify.com/album")) {
                spotifyApi.getAlbumTracks(`${cath[2]}`)
                    .then(async function (data5) {
                        const tracks2 = await data5.body.items
                        for (const track of tracks2) {
                            await handleSpotify2.handleVideo(track, message, voiceChannel, true);
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
                    }, function (err) {
                        console.log('Something went wrong!', err);
                    });
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
                    await playlist_init.handleVideo(video, message, voiceChannel, true);
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
                    if (serverQueue) {
                        if (serverQueue.songs.length > Math.floor(QUEUE_LIMIT - 1) && QUEUE_LIMIT !== 0) {
                            return sendError(`Você não pode adicionar mais de **${QUEUE_LIMIT}** músicas na fila.`, message.channel);
                        }
                    }
                    var searched = await ytlist(searchString)
                    if (searched.length === 0) return sendError("Eu não consegui achar essa playlist :(", message.channel)
                    const videos = await searched.items;
                    for (const video of videos) {
                        await playlist_init.handleVideo(video, message, voiceChannel, true);
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
                }
            }
        } else {
            if (serverQueue) {
                if (serverQueue.songs.length > Math.floor(QUEUE_LIMIT - 1) && QUEUE_LIMIT !== 0) {
                    return sendError(`Você não pode adicionar mais de **${QUEUE_LIMIT}** músicas na fila.`, message.channel);
                }
            }
            try {
                await YouTube.search(searchString, { limit: 1 }).then(async x => {
                    const song = {
                        title: x[0].title ? x[0].title : ytdl.getBasicInfo(songInfo.url).videoDetails.media.song,
                        url: x[0].url,
                        thumbnail: x[0].thumbnail.url,
                        duration: x[0].durationFormatted,
                        liveStream: x[0].live,
                        author: message.author.tag
                    }

                    if (!serverQueue) {
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

                        try {
                            var connection = await voiceChannel.join();
                            queueConstruct.connection = connection
                            await music_init.play(message, queueConstruct.songs[0])
                        } catch (err) {
                            console.log(err);
                            client.queue.delete(message.guild.id)
                            return;
                        }
                    } else {
                        serverQueue.songs.push(song);
                        return message.channel.send({
                            embed: {
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
                            }
                        })
                    }
                })
            } catch (err) {
                if (err.message.includes("Cannot read property 'title' of undefined")) {
                    console.log(`[VIDEO UNAVAILABLE] ${searchString}`)
                    await sendError("**Este vídeo está indisponível.**", message.channel);
                    return;
                }
                return console.log(err);
            }
            return undefined;
        }
    }
};