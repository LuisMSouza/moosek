const { createAudioPlayer, createAudioResource, entersState, StreamType, VoiceConnectionStatus, AudioPlayerStatus } = require("@discordjs/voice");
const { CommandInteraction, Client, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const ytdl = require("play-dl");
const sendError = require('../utils/error.js');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports.play = async (client, message, song) => {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!song) {
        serverQueue.nigthCore = false
        setTimeout(async function () {
            if (serverQueue) {
                if (serverQueue.playing) return
            }
            if (!message.guild.me.voice.channel) return;
            if (message.guild.me.voice.channel && serverQueue.songs.length >= 1) return;
            await serverQueue.connection.disconnect();
            serverQueue.textChannel.send({
                embeds: [{
                    color: "#0f42dc",
                    description: `**Tempo de espera esgotado. Saí do chat ;)**`
                }]
            });
            return message.client.queue.delete(message.guild.id);
        }, STAY_TIME * 1000);
        return;
    }
    try {
        var stream = await ytdl.stream(song.url)
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
    serverQueue.resource = createAudioResource(stream.stream, { inlineVolume: true, inputType: stream.type });
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

        embedMusic.addField("> __Canal:__", "```fix\n" + `${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : "Not provided"}` + "\n```", true)
        embedMusic.addField("> __Pedido por:___", "```fix\n" + `${song.author}` + "\n```", true)

        const button = new MessageButton()
            .setCustomId('pause')
            .setEmoji("⏸️")
            .setStyle('SECONDARY')
        const button2 = new MessageButton()
            .setCustomId('pause_2')
            .setEmoji("⏸️")
            .setStyle('SECONDARY')
            .setDisabled(true)
        const button3 = new MessageButton()
            .setCustomId('play')
            .setEmoji("▶️")
            .setStyle('SECONDARY')
        const button4 = new MessageButton()
            .setCustomId('play_2')
            .setEmoji("▶️")
            .setStyle('SECONDARY')
            .setDisabled(true)
        const button5 = new MessageButton()
            .setCustomId('backward')
            .setEmoji("⏮️")
            .setStyle('SECONDARY')
        const button6 = new MessageButton()
            .setCustomId('forward')
            .setEmoji("⏭️")
            .setStyle('SECONDARY')
        const button7 = new MessageButton()
            .setCustomId('stop')
            .setEmoji("⏹️")
            .setStyle('PRIMSECONDARYARY')

        const row2 = new MessageActionRow()
            .addComponents(button2, button3, button5, button6, button7)
        const row3 = new MessageActionRow()
            .addComponents(button, button4, button5, button6, button7)

        var playingMessage = await serverQueue.textChannel.send({ embeds: [embedMusic], components: [row3] })
        const filter = (button) => button.user.id != client.user.id;
        const collector = playingMessage.channel.createMessageComponentCollector({ filter });

        collector.on("collect", async (b) => {
            var membReact = message.guild.members.cache.get(user.id);
            switch (b.customId) {
                case "pause":
                    if (!message.member.voice.channel) {
                        b.reply({
                            embeds: [{
                                color: "RED",
                                description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                            }]
                            , ephemeral: true
                        })
                        return;
                    }
                    if (serverQueue.voiceChannel.id !== membReact.voice.channel.id) {
                        b.reply({
                            embeds: [{
                                color: "RED",
                                description: "❌ **O bot está sendo utilizado em outro canal!**"
                            }]
                            , ephemeral: true
                        })
                        return;
                    }
                    if (!serverQueue.playing) return;
                    if (serverQueue) {
                        try {
                            serverQueue.playing = false;
                            serverQueue.audioPlayer.pause();
                            b.update({ embeds: [embedMusic], components: [row2] })
                            return undefined;
                        } catch (e) {
                            console.log(e);
                        }
                    } else {
                        await b.update({ embeds: [embedMusic], components: [] })
                        return undefined;
                    }
                    break;
                case "play":
                    if (!message.member.voice.channel) {
                        b.reply({
                            embeds: [{
                                color: "RED",
                                description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                            }]
                            , ephemeral: true
                        })
                        return;
                    }
                    if (serverQueue.voiceChannel.id !== membReact.voice.channel.id) {
                        b.reply({
                            embeds: [{
                                color: "RED",
                                description: "❌ **O bot está sendo utilizado em outro canal!**"
                            }]
                            , ephemeral: true
                        })
                        return;
                    }
                    if (serverQueue.playing) return;
                    if (serverQueue) {
                        try {
                            serverQueue.playing = true;
                            serverQueue.audioPlayer.unpause();
                            b.update({ embeds: [embedMusic], components: [row3] })
                            return undefined;
                        } catch (e) {
                            console.log(e);
                        }
                    } else {
                        await b.update({ embeds: [embedMusic], components: [] })
                        return undefined;
                    }
                    break;
                case "backward":
                    if (!message.member.voice.channel) {
                        b.reply({
                            embeds: [{
                                color: "RED",
                                description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                            }]
                            , ephemeral: true
                        })
                        return;
                    }
                    if (serverQueue.voiceChannel.id !== membReact.voice.channel.id) {
                        b.reply({
                            embeds: [{
                                color: "RED",
                                description: "❌ **O bot está sendo utilizado em outro canal!**"
                            }]
                            , ephemeral: true
                        })
                        return;
                    }
                    if (!serverQueue) {
                        sendError("Não há nada tocando no momento.", message.guild).then(m3 => m3.delete({ timeout: 10000 }));
                        await b.update({ embeds: [embedMusic], components: [] })
                        return;
                    }
                    if (serverQueue) {
                        try {
                            if (serverQueue.prevSongs[0] == undefined || serverQueue.prevSongs[0] === null || serverQueue.prevSongs[0] === []) return sendError("Não há nenhuma música anterior.", message.channel);
                            await serverQueue.songs.shift()
                            await serverQueue.songs.unshift(serverQueue.prevSongs[0]);
                            await b.update({ embeds: [embedMusic], components: [] })
                            await module.exports.play(client, message, serverQueue.songs[0]);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    return;
                    break;
                case "forward":
                    if (!message.member.voice.channel) {
                        b.reply({
                            embeds: [{
                                color: "RED",
                                description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                            }]
                            , ephemeral: true
                        })
                        return;
                    }
                    if (serverQueue.voiceChannel.id !== membReact.voice.channel.id) {
                        b.reply({
                            embeds: [{
                                color: "RED",
                                description: "❌ **O bot está sendo utilizado em outro canal!**"
                            }]
                            , ephemeral: true
                        })
                        return;
                    }
                    if (!serverQueue) {
                        sendError("Não há nada tocando no momento.", message.guild).then(m3 => m3.delete({ timeout: 10000 }));
                        await b.update({ embeds: [embedMusic], components: [] })
                        return;
                    }
                    if (serverQueue) {
                        try {
                            if (!serverQueue.songLooping) {
                                if (!serverQueue.songs[1]) {
                                    serverQueue.songs.shift();
                                    await message.guild.me.voice.disconnect();
                                    await message.client.queue.delete(message.guild.id);
                                    await b.update({ embeds: [embedMusic], components: [] });
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
                    await b.update({ embeds: [embedMusic], components: [] });
                    return;
                    break;
                case "stop":
                    if (!message.member.voice.channel) {
                        b.reply({
                            embeds: [{
                                color: "RED",
                                description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                            }]
                            , ephemeral: true
                        })
                        return;
                    }
                    if (serverQueue.voiceChannel.id !== membReact.voice.channel.id) {
                        b.reply({
                            embeds: [{
                                color: "RED",
                                description: "❌ **O bot está sendo utilizado em outro canal!**"
                            }]
                            , ephemeral: true
                        })
                        return;
                    }
                    if (!serverQueue) {
                        sendError("Não há nada tocando no momento.", message.guild).then(m3 => m3.delete({ timeout: 10000 }));
                        await b.update({ embeds: [embedMusic], components: [] })
                        return;
                    } else {
                        try {
                            serverQueue.songs = [];
                            message.client.queue.set(message.guild.id, serverQueue);
                            await message.guild.me.voice.disconnect();
                            await client.queue.delete(message.guild.id);
                            serverQueue.nigthCore = false
                            await b.update({ embeds: [embedMusic], components: [] });
                            return;
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    break;
            }
            serverQueue.resource.playStream
                .on("end", async () => {
                    await b.update({ embeds: [embedMusic], components: [] });
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
            serverQueue.audioPlayer.on(AudioPlayerStatus.Idle, async () => {
                await b.update({ embeds: [embedMusic], components: [] });
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
        })
    } catch (error) {
        console.log(error)
    }
}