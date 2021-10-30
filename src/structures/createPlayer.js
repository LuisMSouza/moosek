const { createAudioPlayer, createAudioResource, entersState, StreamType, VoiceConnectionStatus } = require("@discordjs/voice");
const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const sendError = require('../utils/error.js');
const leaveChannel = require('../utils/leaveChannel.js');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports.play = async (client, message, song) => {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!song) {
        leaveChannel(client, message, song);
        return;
    }
    try {
        var stream = await ytdl(song.url, { highWaterMark: 1 << 25, filter: "audioonly", quality: "highestaudio" });
    } catch (error) {
        if (serverQueue) {
            if (serverQueue.loop) {
                let lastSong = serverQueue.songs.shift();
                serverQueue.songs.push(lastSong);
                module.exports.play(client, message, serverQueue.songs[0]);
            } else {
                serverQueue.songs.shift();
                module.exports.play(client, message, serverQueue.songs[0]);
            }
        }
    }

    serverQueue.audioPlayer = createAudioPlayer();
    serverQueue.resource = createAudioResource(stream, { inlineVolume: true, inputType: StreamType.Arbitrary });
    serverQueue.audioPlayer.play(serverQueue.resource);

    try {
        await entersState(serverQueue.connection, VoiceConnectionStatus.Ready, 30_000);
        serverQueue.connection.subscribe(serverQueue.audioPlayer);
    } catch (error) {
        serverQueue.connection.destroy();
        throw error;
    }
    try {
        var embedMusic = new MessageEmbed()
            .setAuthor("Tocando agora:")
            .setColor("#0f42dc")
            .setTitle(song.title)
            .setThumbnail(song.thumbnail)
            .setURL(song.url)

        if (song.duration === '0:00' || song.liveStream) {
            embedMusic.addField("> __Duração:__", "🔴 Live", true)
            sendError("**Este video é uma live, talvez não seja possível reproduzir...**", serverQueue.textChannel)
        } else {
            embedMusic.addField("> __Duração:__", "```fix\n" + `${song.duration}` + "\n```", true)
        }

        embedMusic.addField("> __Canal:__", "```fix\n" + `${message.member.voice.channel.name ? message.member.voice.channel.name : "Not provided"}` + "\n```", true)
        embedMusic.addField("> __Pedido por:___", "```fix\n" + `${song.author}` + "\n```", true)

        var playingMessage = await serverQueue.textChannel.send({ embeds: [embedMusic] }).then(async (embed) => {
            try {
                await embed.react("⏸️");
                await embed.react("▶️");
                await embed.react("⏮️");
                await embed.react("⏭️");
                await embed.react("⏹️");
                await embed.react("🔁");
                await embed.react("🔂");
                await embed.react("🔀");
                const collector = embed.createReactionCollector((reaction, user) => ["⏸️", "▶️", "⏮️", "⏭️", "⏹️", "🔁", "🔂", "🔀"].includes(reaction.emoji.name) && user != user.bot);
                collector.on("collect", async (reaction, user) => {
                    var membReact = message.guild.members.cache.get(user.id);
                    switch (reaction.emoji.name) {
                        case "⏸️":
                            if (!message.member.voice.channel) {
                                serverQueue.textChannel.send({
                                    embeds: [{
                                        color: "RED",
                                        description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                    }]
                                }).then(m => m.delete({ timeout: 10000 }));
                                await reaction.users.remove(user);
                                return;
                            }
                            if (serverQueue.voiceChannel.id !== membReact.voice.channel.id) {
                                serverQueue.textChannel.send({
                                    embeds: [{
                                        color: "RED",
                                        description: "❌ **O bot está sendo utilizado em outro canal!**"
                                    }]
                                }).then(m2 => m2.delete({ timeout: 10000 }))
                                await reaction.users.remove(user);
                                return;
                            }
                            if (serverQueue) {
                                try {
                                    serverQueue.playing = false;
                                    serverQueue.audioPlayer.pause();
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
                                serverQueue.textChannel.send({
                                    embeds: [{
                                        color: "RED",
                                        description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                    }]
                                }).then(m => m.delete({ timeout: 10000 }));
                                await reaction.users.remove(user);
                                return;
                            }
                            if (serverQueue.voiceChannel.id !== membReact.voice.channel.id) {
                                serverQueue.textChannel.send({
                                    embeds: [{
                                        color: "RED",
                                        description: "❌ **O bot está sendo utilizado em outro canal!**"
                                    }]
                                }).then(m2 => m2.delete({ timeout: 10000 }))
                                await reaction.users.remove(user);
                                return;
                            }
                            if (serverQueue) {
                                try {
                                    serverQueue.playing = true;
                                    serverQueue.audioPlayer.unpause();
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
                        case "⏮️":
                            if (!message.member.voice.channel) {
                                serverQueue.textChannel.send({
                                    embeds: [{
                                        color: "RED",
                                        description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                    }]
                                }).then(m => m.delete({ timeout: 10000 }));
                                await reaction.users.remove(user);
                                return;
                            }
                            if (serverQueue.voiceChannel.id !== membReact.voice.channel.id) {
                                serverQueue.textChannel.send({
                                    embeds: [{
                                        color: "RED",
                                        description: "❌ **O bot está sendo utilizado em outro canal!**"
                                    }]
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
                                await reaction.users.remove(user);
                                try {
                                    if (serverQueue.prevSongs[0] == undefined || serverQueue.prevSongs[0] === null || serverQueue.prevSongs[0] === []) return sendError("Não há nenhuma música anterior.", message.channel);
                                    await serverQueue.songs.shift()
                                    await serverQueue.songs.unshift(serverQueue.prevSongs[0]);
                                    //dispatcher.end();
                                    await module.exports.play(client, message, serverQueue.songs[0]);
                                } catch (e) {
                                    console.log(e);
                                }
                            }
                            embed.reactions.removeAll().catch(error => console.error('Falha ao remover as reações: ', error));
                            return;
                            break;
                        case "⏭️":
                            if (!message.member.voice.channel) {
                                serverQueue.textChannel.send({
                                    embeds: [{
                                        color: "RED",
                                        description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                    }]
                                }).then(m => m.delete({ timeout: 10000 }));
                                await reaction.users.remove(user);
                                return;
                            }
                            if (serverQueue.voiceChannel.id !== membReact.voice.channel.id) {
                                serverQueue.textChannel.send({
                                    embeds: [{
                                        color: "RED",
                                        description: "❌ **O bot está sendo utilizado em outro canal!**"
                                    }]
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
                                    if (!serverQueue.songLooping) {
                                        if (!serverQueue.songs[1]) {
                                            serverQueue.songs.shift();
                                            await message.guild.me.voice.disconnect();
                                            await message.client.queue.delete(message.guild.id);
                                            embed.reactions.removeAll().catch(error => console.error('Falha ao remover as reações: ', error));
                                            return;
                                        }
                                        serverQueue.prevSongs = [];
                                        await serverQueue.prevSongs.push(serverQueue.songs[0]);
                                        if (serverQueue.looping) {
                                            await serverQueue.songs.push(serverQueue.songs[0]);
                                        }
                                        serverQueue.songs.shift();
                                        if (serverQueue.nigthCore) {
                                            const random = Math.floor(Math.random() * (serverQueue.songs.length));
                                            module.exports.play(client, message, serverQueue.songs[random]);
                                        } else {
                                            module.exports.play(client, message, serverQueue.songs[0]);
                                        }
                                    } else {
                                        module.exports.play(client, message, serverQueue.songs[0]);
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
                                serverQueue.textChannel.send({
                                    embeds: [{
                                        color: "RED",
                                        description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                    }]
                                }).then(m => m.delete({ timeout: 10000 }));
                                await reaction.users.remove(user);
                                return;
                            }
                            if (serverQueue.voiceChannel.id !== membReact.voice.channel.id) {
                                serverQueue.textChannel.send({
                                    embeds: [{
                                        color: "RED",
                                        description: "❌ **O bot está sendo utilizado em outro canal!**"
                                    }]
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
                                message.client.queue.set(message.guild.id, serverQueue);
                                await message.guild.me.voice.disconnect();
                                await client.queue.delete(message.guild.id);
                                serverQueue.nigthCore = false
                                await embed.reactions.removeAll().catch(error => console.error(`${text.errors.error_reactions_remove}`, error));
                                return;
                            } catch (e) {
                                console.log(e);
                            }
                            break;
                        case "🔁":
                            if (!message.member.voice.channel) {
                                serverQueue.textChannel.send({
                                    embeds: [{
                                        color: "RED",
                                        description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                    }]
                                }).then(m => m.delete({ timeout: 10000 }));
                                await reaction.users.remove(user);
                                return;
                            }
                            if (serverQueue.voiceChannel.id !== membReact.voice.channel.id) {
                                serverQueue.textChannel.send({
                                    embeds: [{
                                        color: "RED",
                                        description: "❌ **O bot está sendo utilizado em outro canal!**"
                                    }]
                                }).then(m2 => m2.delete({ timeout: 10000 }))
                                await reaction.users.remove(user);
                                return;
                            }
                            await reaction.users.remove(user);
                            if (!serverQueue) return;
                            if (serverQueue.nigthCore) return sendError("Esta opção não pode ser ativada no modo aleatório.", message.channel);
                            if (serverQueue.songLooping) return sendError("Esta opção não pode ser ativada com o loop da música ativado.", message.channel);
                            if (serverQueue.songs.length === 1) return sendError("A fila de músicas só possui uma música.\nCaso queira repeti-la, ative 🔂", message.channel)
                            try {
                                serverQueue.looping = !serverQueue.looping;
                                return serverQueue.textChannel.send({
                                    embeds: [{
                                        color: "#0f42dc",
                                        description: `🔁 Loop da fila de músicas ${serverQueue.looping ? `**Habilitado**` : `**Desabilitado**`}`
                                    }]
                                });
                            } catch (e) {
                                console.log(e);
                            }
                            break;
                        case "🔂":
                            if (!message.member.voice.channel) {
                                serverQueue.textChannel.send({
                                    embeds: [{
                                        color: "RED",
                                        description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                    }]
                                }).then(m => m.delete({ timeout: 10000 }));
                                await reaction.users.remove(user);
                                return;
                            }
                            if (serverQueue.voiceChannel.id !== membReact.voice.channel.id) {
                                serverQueue.textChannel.send({
                                    embeds: [{
                                        color: "RED",
                                        description: "❌ **O bot está sendo utilizado em outro canal!**"
                                    }]
                                }).then(m2 => m2.delete({ timeout: 10000 }))
                                await reaction.users.remove(user);
                                return;
                            }
                            if (!serverQueue) return;
                            try {
                                serverQueue.songLooping = !serverQueue.songLooping
                                await reaction.users.remove(user);
                                return serverQueue.textChannel.send({
                                    embeds: [{
                                        color: "#0f42dc",
                                        description: `🔂 Loop para \`${serverQueue.songs[0].title}\` ${serverQueue.songLooping ? `**Habilitado**` : `**Desabilitado**`}`
                                    }]
                                });
                            } catch (e) {
                                console.log(e);
                            }
                            break;
                        case "🔀":
                            if (!message.member.voice.channel) {
                                serverQueue.textChannel.send({
                                    embeds: [{
                                        color: "RED",
                                        description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                    }]
                                }).then(m => m.delete({ timeout: 10000 }));
                                await reaction.users.remove(user);
                                return;
                            }
                            if (serverQueue.voiceChannel.id !== membReact.voice.channel.id) {
                                serverQueue.textChannel.send({
                                    embeds: [{
                                        color: "RED",
                                        description: "❌ **O bot está sendo utilizado em outro canal!**"
                                    }]
                                }).then(m2 => m2.delete({ timeout: 10000 }))
                                await reaction.users.remove(user);
                                return;
                            }
                            if (!serverQueue) return;
                            try {
                                serverQueue.nigthCore = !serverQueue.nigthCore
                                //if (serverQueue.looping) return sendError("Desative o Loop da fila de músicas primeiro ;)", message.channel);
                                await reaction.users.remove(user);
                                return serverQueue.textChannel.send({
                                    embeds: [{
                                        color: "#0f42dc",
                                        description: `🔀 Modo aleatório ${serverQueue.nigthCore ? `**Habilitado**` : `**Desabilitado**`}`
                                    }]
                                });
                            } catch (e) {
                                console.log(e);
                            }
                            break;
                    }
                });
            } catch (err) {
                console.log(err)
            }
            serverQueue.resource.playStream
                .on("end", async () => {
                    embed.reactions.removeAll();
                    if (playingMessage && playingMessage.deleted)
                        playingMessage.delete().catch(console.error);
                    if (serverQueue.looping) {
                        let lastSong = serverQueue.songs.shift();
                        serverQueue.songs.push(lastSong);
                        module.exports.play(client, message, serverQueue.songs[0]);
                    } if (serverQueue.nigthCore) {
                        if (!serverQueue.songLooping) await serverQueue.songs.shift();
                        var random = Math.floor(Math.random() * (serverQueue.songs.length));
                        module.exports.play(client, message, serverQueue.songs[random]);
                    } else {
                        if (!serverQueue.songLooping) await serverQueue.songs.shift();
                        module.exports.play(client, message, serverQueue.songs[0]);
                    }
                })
                .on("error", (error) => {
                    console.log(error);
                    if (playingMessage && !playingMessage.deleted)
                        playingMessage.delete().catch(console.error);

                    if (serverQueue.loop) {
                        let lastSong = serverQueue.songs.shift();
                        serverQueue.songs.push(lastSong);
                        module.exports.play(client, message, serverQueue.songs[0]);
                    } else {
                        serverQueue.songs.shift();
                        module.exports.play(client, message, serverQueue.songs[0]);
                    }
                })
            serverQueue.audioPlayer
                .on("error", (error) => {
                    console.log(error);
                    if (playingMessage && playingMessage.deleted)
                        playingMessage.delete().catch(console.error);

                    if (serverQueue.loop) {
                        let lastSong = serverQueue.songs.shift();
                        serverQueue.songs.push(lastSong);
                        module.exports.play(client, message, serverQueue.songs[0]);
                    } else {
                        serverQueue.songs.shift();
                        module.exports.play(client, message, serverQueue.songs[0]);
                    }
                });
        })
    } catch (error) {
        console.log(error)
    }
}