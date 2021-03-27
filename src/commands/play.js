/////////////////////// IMPORTS //////////////////////////
const ytlist = require('ytpl');;
const ytdl = require('ytdl-core');
const yts = require("yt-search");
const sendError = require('../utils/error.js')
const { QUEUE_LIMIT } = require('../utils/botUtils.js');
const YouTube = require("youtube-sr").default;
const music_init = require('../structures/music_init.js');
const playlist_init = require('../structures/playlist_init');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "play",
    description: "Para tocar músicas no servidor",
    usage: [process.env.PREFIX_KEY + 'play [nome da música / link da música / link da playlist]'],
    category: 'user',
    timeout: 3000,
    aliases: ['p', 'tocar', 'iniciar'],

    async execute(client, message, args) {
        const searchString = args.join(" ");
        if (!searchString) return sendError("Você precisa digitar a música a ser tocada", message.channel);
        const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
        if (!searchString || !url) return sendError(`Como usar: .p <Link da música ou playlist | Nome da música>`, message.channel);
        const serverQueue = client.queue.get(message.guild.id);

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return sendError("Você precisa estar em um canal de voz para iniciar uma música!", message.channel);

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) return sendError("Eu não teho permissões para conectar nesse canal :(", message.channel).then(m2 => m2.delete({ timeout: 10000 }));
        if (!permissions.has("SPEAK")) return sendError("Eu não teho permissões para falar nesse canal :(", message.channel).then(m3 => m3.delete({ timeout: 10000 }));

        playlistRegex = /^http(s)?:\/\/(www\.)?youtube.com\/.+list=.+$/
        isPlaylist = playlistRegex.test(url)

        if (isPlaylist) {
            try {
                if (serverQueue) {
                    if (serverQueue.songs.length > Math.floor(QUEUE_LIMIT - 1) && QUEUE_LIMIT !== 0) {
                        return sendError(`Você não pode adicionar mais de **${QUEUE_LIMIT}** músicas na fila.`, message.channel);
                    }
                }
                const playlist = await ytlist(`${url.split("list=")[1]}`);
                if (!playlist) return sendError("Playlist não encontrada", message.channel)
                const videos = await playlist.items;
                for (const video of videos) {
                    await playlist_init.handleVideo(video, message, voiceChannel, true);
                }
                return message.channel.send({
                    embed: {
                        description: `**Playlist adicionada à fila**`
                    }
                });
            } catch {
                try {
                    if (serverQueue) {
                        if (serverQueue.songs.length > Math.floor(QUEUE_LIMIT - 1) && QUEUE_LIMIT !== 0) {
                            return sendError(`Você não pode adicionar mais de **${QUEUE_LIMIT}** músicas na fila.`, message.channel);
                        }
                    }
                    var searched = await yts.search(url)

                    if (searched.playlists.length === 0) return sendError("Eu não consegui achar essa playlist :(", message.channel)
                    var songInfo = searched.playlists[0];
                    let listurl = songInfo.listId;
                    const playlist = await ytlist(listurl);
                    const videos = await playlist.items;
                    for (const video of videos) {
                        await playlist_init.handleVideo(video, message, voiceChannel, true);
                    }
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
                    }

                    if (!serverQueue) {
                        const queueConstruct = {
                            textChannel: message.channel,
                            voiceChannel: voiceChannel,
                            connection: null,
                            songs: [],
                            volume: 5,
                            playing: true,
                            loop: false
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
                                title: "Adicionado à fila",
                                description: `**${song.title}** foi adicionada à fila`
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