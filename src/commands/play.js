/////////////////////// IMPORTS //////////////////////////
const ytlist = require('ytpl');;
const { MessageEmbed, Util } = require('discord.js');
const ytdl = require('ytdl-core');
const yts = require("yt-search");
const sendError = require('../utils/error.js')
const { QUEUE_LIMIT, STAY_TIME } = require('../utils/botUtils.js');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "play",
    description: "Para tocar músicas no servidor",
    usage: [process.env.PREFIX_KEY + 'play [nome da música / link da música / link da playlist]'],
    category: 'user',
    timeout: 5000,
    aliases: ['p', 'tocar', 'iniciar'],

    async execute(client, message, args) {
        const searchString = args.join(" ");
        if (!searchString) return sendError("Você precisa digitar a música a ser tocada", message.channel);
        const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
        if (!searchString || !url) return sendError(`Como usar: .p <Link da música ou playlist | Nome da música>`, message.channel);
        const serverQueue = client.queue.get(message.guild.id);

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return sendError("Você precisa estar em um canal de voz para iniciar uma música!", message.channel).then(m => m.delete({ timeout: 10000 }));

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
                    await handleVideo(video, message, voiceChannel, true);
                }
                return message.channel.send({
                    embed: {
                        description: `**Playlist adicionada à fila**`
                    }
                })
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
                        await handleVideo(video, message, message.channel, true);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        } else {
            try {
                if (serverQueue) {
                    if (serverQueue.songs.length > Math.floor(QUEUE_LIMIT - 1) && QUEUE_LIMIT !== 0) {
                        return sendError(`Você não pode adicionar mais de **${QUEUE_LIMIT}** músicas na fila.`, message.channel);
                    }
                }
                yts(searchString, async (err, result) => {
                    const songInfo = result.videos[0];

                    const song = {
                        title: songInfo.title ? songInfo.title : (await ytdl.getInfo(songInfo.url)).videoDetails.media.song,
                        url: songInfo.url,
                        thumbnail: songInfo.thumbnail,
                        duration: songInfo.timestamp,
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
                            play(message.guild, queueConstruct.songs[0])
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
                    return undefined;
                })
            } catch (err) {
                console.log(err);
            }
        }

        async function handleVideo(video, message, channel, playlist = false) {
            const serverQueue = message.client.queue.get(message.guild.id);

            const song = {
                id: video.id,
                title: video.title ? video.title : (await ytdl.getInfo(video.shortUrl)).videoDetails.media.song,
                url: video.shortUrl,
                thumbnail: video.thumbnails[0].url,
                duration: video.duration,
                isLive: video.isLive,
            }

            if (!serverQueue) {
                const queueConstruct = {
                    textChannel: message.channel,
                    voiceChannel: channel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true,
                    loop: false
                };
                message.client.queue.set(message.guild.id, queueConstruct);
                queueConstruct.songs.push(song);

                try {
                    var connection = await channel.join();
                    queueConstruct.connection = connection;
                    play(message.guild, queueConstruct.songs[0]);
                } catch (error) {
                    console.error(`Eu não consegui entrar no canal: ${error}`);
                    message.client.queue.delete(message.guild.id);
                    return sendError(`Eu não consegui entrar no canal: ${error}`, message.channel);

                }
            } else {
                serverQueue.songs.push(song);
                if (playlist) return;
                let thing = new MessageEmbed()
                    .setTitle(`Música adicionada à fila`)
                    .setThumbnail(song.img)
                    .setDescription(`**__${song.title}__** adicionado à fila`)
                return message.channel.send(thing);
            }
            return;
        }

        async function play(guild, song) {
            const serverQueue = client.queue.get(guild.id)

            if (!song) {
                var timer = setTimeout(async function () {
                    if (serverQueue.connection.dispatcher && !message.guild.me.voice.channel) return;
                    if (!message.guild.me.voice.channel) return;
                    serverQueue.voiceChannel.leave();
                    serverQueue.textChannel.send({
                        embed: {
                            description: `Tempo de espera esgotado. Saí do chat ;)`
                        }
                    })
                    clearTimeout(timer);
                }, STAY_TIME * 1000);
                return message.client.queue.delete(message.guild.id);
            }

            let url = song.url;
            const dispatcher = serverQueue.connection.play(ytdl(url, { highWaterMark: 1 << 25, filter: "audioonly", quality: "highestaudio" }))
                .on("error", error => {
                    console.log(error);
                })
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5)
            let songEmbed = new MessageEmbed()
                .setAuthor("Tocando agora:")
                .setTitle(song.title)
                .setThumbnail(song.thumbnail)
                .setURL(song.url)
                .addField("Duração:", song.duration)

            message.channel.send(songEmbed).then(async (embed) => {
                try {
                    await embed.react("⏸️");
                    await embed.react("▶️");
                    await embed.react("⏭️");
                    await embed.react("⏹️");
                    await embed.react("🔂");
                    const collector = embed.createReactionCollector((reaction, user) => ["⏸️", "▶️", "⏭️", "⏹️", "🔂"].includes(reaction.emoji.name) && user != user.bot);
                    collector.on("collect", async (reaction, user) => {
                        switch (reaction.emoji.name) {
                            case "⏸️":
                                if (!message.member.voice.channel) {
                                    message.channel.send({
                                        embed: {
                                            description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                        }
                                    }).then(m => m.delete({ timeout: 10000 }));
                                    await reaction.users.remove(user);
                                    return;
                                }
                                if (serverQueue.connection.channel.id !== message.member.voice.channel.id) {
                                    message.channel.send({
                                        embed: {
                                            description: "❌ **O bot está sendo utilizado em outro canal!**"
                                        }
                                    }).then(m2 => m2.delete({ timeout: 10000 }))
                                    await reaction.users.remove(user);
                                    return;
                                }
                                if (serverQueue) {
                                    try {
                                        serverQueue.playing = false;
                                        serverQueue.connection.dispatcher.pause();
                                        await reaction.users.remove(user);
                                        return undefined;
                                    } catch (e) {
                                        console.log(e);
                                    }
                                } else {
                                    await embed.reactions.removeAll().catch(error => console.error('Falha ao remover as reações: ', error));
                                    return undefined;
                                }
                                break;
                            case "▶️":
                                if (!message.member.voice.channel) {
                                    message.channel.send({
                                        embed: {
                                            description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                        }
                                    }).then(m => m.delete({ timeout: 10000 }));
                                    await reaction.users.remove(user);
                                    return;
                                }
                                if (serverQueue.connection.channel.id !== message.member.voice.channel.id) {
                                    message.channel.send({
                                        embed: {
                                            description: "❌ **O bot está sendo utilizado em outro canal!**"
                                        }
                                    }).then(m2 => m2.delete({ timeout: 10000 }))
                                    await reaction.users.remove(user);
                                    return;
                                }
                                if (serverQueue) {
                                    try {
                                        serverQueue.playing = true;
                                        serverQueue.connection.dispatcher.resume();
                                        await reaction.users.remove(user);
                                        return undefined;
                                    } catch (e) {
                                        console.log(e);
                                    }
                                } else {
                                    await embed.reactions.removeAll().catch(error => console.error('Falha ao remover as reações: ', error));
                                    return undefined;
                                }
                                break;
                            case "⏭️":
                                if (!message.member.voice.channel) {
                                    message.channel.send({
                                        embed: {
                                            description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                        }
                                    }).then(m => m.delete({ timeout: 10000 }));
                                    await reaction.users.remove(user);
                                    return;
                                }
                                if (serverQueue.connection.channel.id !== message.member.voice.channel.id) {
                                    message.channel.send({
                                        embed: {
                                            description: "❌ **O bot está sendo utilizado em outro canal!**"
                                        }
                                    }).then(m2 => m2.delete({ timeout: 10000 }))
                                    await reaction.users.remove(user);
                                    return;
                                }
                                if (!serverQueue) {
                                    sendError("Não há nada tocando no momento.", message.guild).then(m3 => m3.delete({ timeout: 10000 }));
                                    await embed.reactions.removeAll().catch(error => console.error('Falha ao remover as reações: ', error));
                                    return;
                                }
                                if (serverQueue) {
                                    try {
                                        if (!serverQueue.loop) {
                                            if (!serverQueue.songs[1]) {
                                                message.member.voice.channel.leave();
                                                embed.reactions.removeAll().catch(error => console.error('Falha ao remover as reações: ', error));
                                                return;
                                            }
                                            serverQueue.songs.shift();
                                            await play(guild, serverQueue.songs[0])
                                        } else {
                                            await play(guild, serverQueue.songs[0])
                                        }
                                    } catch (e) {
                                        console.log(e);
                                    }
                                }
                                embed.reactions.removeAll().catch(error => console.error('Falha ao remover as reações: ', error));
                                return;
                                break;
                            case "⏹️":
                                if (!message.member.voice.channel) {
                                    message.channel.send({
                                        embed: {
                                            description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                        }
                                    }).then(m => m.delete({ timeout: 10000 }));
                                    await reaction.users.remove(user);
                                    return;
                                }
                                if (serverQueue.connection.channel.id !== message.member.voice.channel.id) {
                                    message.channel.send({
                                        embed: {
                                            description: "❌ **O bot está sendo utilizado em outro canal!**"
                                        }
                                    }).then(m2 => m2.delete({ timeout: 10000 }))
                                    await reaction.users.remove(user);
                                    return;
                                }
                                if (!serverQueue) {
                                    sendError("Não há nada tocando no momento.", message.guild).then(m3 => m3.delete({ timeout: 10000 }));
                                    await embed.reactions.removeAll().catch(error => console.error('Falha ao remover as reações: ', error));
                                    return;
                                }
                                try {
                                    serverQueue.songs = [];
                                    client.queue.set(message.guild.id, serverQueue);
                                    await message.member.voice.channel.leave();
                                    await embed.reactions.removeAll().catch(error => console.error(`${text.errors.error_reactions_remove}`, error));
                                    return;
                                } catch (e) {
                                    console.log(e);
                                }
                                break;
                            case "🔂":
                                if (!message.member.voice.channel) {
                                    message.channel.send({
                                        embed: {
                                            description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                        }
                                    }).then(m => m.delete({ timeout: 10000 }));
                                    await reaction.users.remove(user);
                                    return;
                                }
                                if (serverQueue.connection.channel.id !== message.member.voice.channel.id) {
                                    message.channel.send({
                                        embed: {
                                            description: "❌ **O bot está sendo utilizado em outro canal!**"
                                        }
                                    }).then(m2 => m2.delete({ timeout: 10000 }))
                                    await reaction.users.remove(user);
                                    return;
                                }
                                if (!serverQueue) return;
                                try {
                                    serverQueue.loop = !serverQueue.loop
                                    await reaction.users.remove(user);
                                    return message.channel.send({
                                        embed: {
                                            description: `🔁 Loop ${serverQueue.loop ? `**Habilitado**` : `**Desabilitado**`}`
                                        }
                                    })
                                } catch (e) {
                                    console.log(e);
                                }
                                break;
                        }
                    })
                } catch (err) {
                    console.log(err)
                }
                dispatcher.on("finish", async () => {
                    if (!serverQueue.loop) serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0])
                    embed.reactions.removeAll().catch(error => console.error('Falha ao remover as reações: ', error));
                })
            });
        }
    }
};