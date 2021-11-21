const { createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus, AudioPlayerStatus } = require("@discordjs/voice");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const ytdl2 = require("play-dl");
const sendError = require('../utils/error.js');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports.play = async (client, message, song) => {
    const ePlay = client.guilds.cache.get("731542666277290016").emojis.cache.find(emj => emj.name === "3634002");
    const ePause = client.guilds.cache.get("731542666277290016").emojis.cache.find(emj => emj.name === "3635043");
    const eNext = client.guilds.cache.get("731542666277290016").emojis.cache.find(emj => emj.name === "3635063");
    const eBack = client.guilds.cache.get("731542666277290016").emojis.cache.find(emj => emj.name === "3635051");
    const eStop = client.guilds.cache.get("731542666277290016").emojis.cache.find(emj => emj.name === "3635035");
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!song) {
        await message.client.queue.delete(message.guild.id);
        return serverQueue.connection.disconnect();
    }
    try {
        var stream = await ytdl2.stream(song.url);
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

    try {
        serverQueue.audioPlayer = createAudioPlayer();
        serverQueue.resource = createAudioResource(stream.stream, { inlineVolume: true, inputType: stream.type });
        serverQueue.audioPlayer.play(serverQueue.resource);
        await entersState(serverQueue.connection, VoiceConnectionStatus.Ready, 30_000);
        serverQueue.connection.subscribe(serverQueue.audioPlayer);
    } catch (error) {
        serverQueue.connection.destroy();
        console.log(error);
        return sendError("Alguma coisa desastrosa aconteceu :(\nTente novamente...", message.channel);
    }
    try {
        var embedMusic = new MessageEmbed()
            .setAuthor("Tocando agora:")
            .setColor("#2592b0")
            .setTitle(serverQueue.songs[0].title)
            .setThumbnail(serverQueue.songs[0].thumbnail)
            .setURL(serverQueue.songs[0].url)

        if (serverQueue.songs[0].duration === '0:00' || serverQueue.songs[0].liveStream) {
            embedMusic.addField("> __Duração:__", "```ini\n🔴 Live\n```", true);
        } else {
            embedMusic.addField("> __Duração:__", "```ini\n" + `${serverQueue.songs[0].duration}` + "\n```", true)
        }

        embedMusic.addField("> __Canal:__", "```ini\n" + `${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : "Not provided"}` + "\n```", true)
        embedMusic.addField("> __Pedido por:___", "```ini\n" + `${serverQueue.songs[0].author}` + "\n```", true)

        const button = new MessageButton()
            .setCustomId('pause')
            .setEmoji(ePause)
            .setStyle('SECONDARY')
        const button2 = new MessageButton()
            .setCustomId('pause_2')
            .setEmoji(ePause)
            .setStyle('SECONDARY')
            .setDisabled(true)
        const button3 = new MessageButton()
            .setCustomId('play')
            .setEmoji(ePlay)
            .setStyle('SECONDARY')
        const button4 = new MessageButton()
            .setCustomId('play_2')
            .setEmoji(ePlay)
            .setStyle('SECONDARY')
            .setDisabled(true)
        const button5 = new MessageButton()
            .setCustomId('backward')
            .setEmoji(eBack)
            .setStyle('SECONDARY')
        const button6 = new MessageButton()
            .setCustomId('forward')
            .setEmoji(eNext)
            .setStyle('SECONDARY')
        const button7 = new MessageButton()
            .setCustomId('stop')
            .setEmoji(eStop)
            .setStyle('SECONDARY')

        const row2 = new MessageActionRow()
            .addComponents(button2, button3, button5, button6, button7)
        const row3 = new MessageActionRow()
            .addComponents(button, button4, button5, button6, button7)

        var playingMessage = await serverQueue.textChannel.send({ embeds: [song.embed], components: [row3] })
        const filter = (button) => button.user.id != client.user.id;
        const collector = playingMessage.channel.createMessageComponentCollector({ filter });

        collector.on("collect", async (b) => {
            var membReact = message.guild.members.cache.get(b.user.id);
            var idBot = message.guild.members.cache.get(client.user.id);
            switch (b.customId) {
                case "pause":
                    if (!message.member.voice.channel) {
                        b.followUp({
                            embeds: [{
                                color: "RED",
                                description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                            }]
                            , ephemeral: true
                        }).then((m) => {
                            setTimeout(() => m.delete(), 2000)
                        });
                        return;
                    }
                    if (idBot.voice.channel.id !== membReact.voice.channel.id) {
                        b.followUp({
                            embeds: [{
                                color: "RED",
                                description: "❌ **O bot está sendo utilizado em outro canal!**"
                            }]
                            , ephemeral: true
                        }).then((m) => {
                            setTimeout(() => m.delete(), 2000)
                        });
                        return;
                    }
                    if (!serverQueue.playing) return;
                    if (serverQueue) {
                        try {
                            serverQueue.playing = false;
                            serverQueue.audioPlayer.pause();
                            await b.update({ embeds: [serverQueue.songs[0].embed], components: [row2] });
                        } catch (e) {
                            console.log(e);
                        }
                    } else {
                        await b.update({ embeds: [serverQueue.songs[0].embed], components: [] });
                    }
                    return;
                    break;
                case "play":
                    if (!message.member.voice.channel) {
                        b.followUp({
                            embeds: [{
                                color: "RED",
                                description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                            }]
                            , ephemeral: true
                        }).then((m) => {
                            setTimeout(() => m.delete(), 2000)
                        });
                        return;
                    }
                    if (idBot.voice.channel.id !== membReact.voice.channel.id) {
                        b.followUp({
                            embeds: [{
                                color: "RED",
                                description: "❌ **O bot está sendo utilizado em outro canal!**"
                            }]
                            , ephemeral: true
                        }).then((m) => {
                            setTimeout(() => m.delete(), 2000)
                        });
                        return;
                    }
                    if (serverQueue.playing) return;
                    if (serverQueue) {
                        try {
                            serverQueue.playing = true;
                            serverQueue.audioPlayer.unpause();
                            await b.update({ embeds: [serverQueue.songs[0].embed], components: [row3] });
                        } catch (e) {
                            console.log(e);
                        }
                    } else {
                        await b.update({ embeds: [serverQueue.songs[0].embed], components: [] });
                    }
                    return;
                    break;
                case "backward":
                    if (!message.member.voice.channel) {
                        b.followUp({
                            embeds: [{
                                color: "RED",
                                description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                            }]
                            , ephemeral: true
                        }).then((m) => {
                            setTimeout(() => m.delete(), 2000)
                        });
                        return;
                    }
                    if (idBot.voice.channel.id !== membReact.voice.channel.id) {
                        b.followUp({
                            embeds: [{
                                color: "RED",
                                description: "❌ **O bot está sendo utilizado em outro canal!**"
                            }]
                            , ephemeral: true
                        }).then((m) => {
                            setTimeout(() => m.delete(), 2000)
                        });
                        return;
                    }
                    if (!serverQueue) {
                        sendError("Não há nada tocando no momento.", message.guild).then(m3 => m3.delete({ timeout: 10000 }));
                    }
                    if (serverQueue) {
                        try {
                            if (serverQueue.prevSongs[0] == undefined || serverQueue.prevSongs[0] === null || serverQueue.prevSongs[0] === []) {
                                sendError("Não há nenhuma música anterior.", message.channel);
                            }
                            await b.update({ embeds: [song.embed], components: [] });
                            await collector.stop();
                            await serverQueue.songs.unshift(serverQueue.prevSongs[0]);
                            await this.play(client, message, serverQueue.songs[0]);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    return;
                    break;
                case "forward":
                    if (!message.member.voice.channel) {
                        b.followUp({
                            embeds: [{
                                color: "RED",
                                description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                            }]
                            , ephemeral: true
                        }).then((m) => {
                            setTimeout(() => m.delete(), 2000)
                        });
                        return;
                    }
                    if (idBot.voice.channel.id !== membReact.voice.channel.id) {
                        b.followUp({
                            embeds: [{
                                color: "RED",
                                description: "❌ **O bot está sendo utilizado em outro canal!**"
                            }]
                            , ephemeral: true
                        }).then((m) => {
                            setTimeout(() => m.delete(), 2000)
                        });
                        return;
                    }
                    if (!serverQueue) {
                        sendError("Não há nada tocando no momento.", message.guild);
                        return;
                    }
                    if (serverQueue) {
                        try {
                            if (serverQueue.songs.length <= 1) {
                                serverQueue.songs.shift();
                                await message.guild.me.voice.disconnect();
                                await message.client.queue.delete(message.guild.id);
                                await collector.stop();
                                return b.update({ embeds: [song.embed], components: [] });
                            } else if (serverQueue.songs.length > 1) {
                                serverQueue.prevSongs = [];
                                await serverQueue.prevSongs.push(serverQueue.songs[0]);
                                if (serverQueue.looping) {
                                    await serverQueue.songs.push(serverQueue.songs[0]);
                                }
                                if (serverQueue.nigthCore) {
                                    const random = Math.floor(Math.random() * (serverQueue.songs.length));
                                    await collector.stop();
                                    this.play(client, message, serverQueue.songs[random]);
                                    serverQueue.songs.delete(random)
                                    return b.update({ embeds: [song.embed], components: [] });
                                }
                                await serverQueue.songs.shift();
                                await b.update({ embeds: [song.embed], components: [] });
                                await collector.stop();
                                this.play(client, message, serverQueue.songs[0]);
                                return;
                            }
                        } catch (e) {
                            console.log(e);
                            await serverQueue.songs.shift();
                            await this.play(client, message, serverQueue.songs[0]);
                            return sendError("Erro ao reagir :(", serverQueue.textChannel);
                        }
                    }
                    return;
                    break;
                case "stop":
                    if (!message.member.voice.channel) {
                        b.followUp({
                            embeds: [{
                                color: "RED",
                                description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                            }]
                            , ephemeral: true
                        }).then((m) => {
                            setTimeout(() => m.delete(), 2000)
                        });
                        return;
                    }
                    if (idBot.voice.channel.id !== membReact.voice.channel.id) {
                        b.followUp({
                            embeds: [{
                                color: "RED",
                                description: "❌ **O bot está sendo utilizado em outro canal!**"
                            }]
                            , ephemeral: true
                        }).then((m) => {
                            setTimeout(() => m.delete(), 2000)
                        });
                        return;
                    }
                    if (!serverQueue) {
                        sendError("Não há nada tocando no momento.", message.guild).then(m3 => m3.delete({ timeout: 10000 }));
                        await b.update({ embeds: [serverQueue.songs[0].embed], components: [] });
                    } else {
                        try {
                            await b.update({ embeds: [serverQueue.songs[0].embed], components: [] });
                            await collector.stop();
                            serverQueue.songs = [];
                            message.client.queue.set(message.guild.id, serverQueue);
                            await message.guild.me.voice.disconnect();
                            await client.queue.delete(message.guild.id);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    return;
                    break;
            }
            return;
        })
        serverQueue.audioPlayer.on('stateChange', async (oldState, newState) => {
            if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
                await playingMessage.edit({ embeds: [song.embed], components: [] });
                await collector.stop();
                if (serverQueue.looping) {
                    let lastSong = serverQueue.songs.shift();
                    serverQueue.songs.push(lastSong);
                    return module.exports.play(client, message, serverQueue.songs[0]);
                } if (serverQueue.nigthCore) {
                    if (!serverQueue.songLooping) await serverQueue.songs.shift();
                    var random = Math.floor(Math.random() * (serverQueue.songs.length));
                    return module.exports.play(client, message, serverQueue.songs[random]);
                }
                if (!serverQueue.songLooping) await serverQueue.songs.shift();
                return module.exports.play(client, message, serverQueue.songs[0]);
            }
        })
    } catch (error) {
        console.log(error)
    }
}