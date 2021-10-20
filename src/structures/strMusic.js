/////////////////////// IMPORTS //////////////////////////
const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const sendError = require('../utils/error.js')
const guild_main = process.env.SERVER_MAIN
const leaveChannel = require('../utils/leaveChannel.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    async play(client, message, song, player) {
        const serverMain = client.guilds.cache.get(guild_main);
        const channelMain = serverMain.channels.cache.get("807738719556993064");
        const serverQueue = await message.client.queue.get(message.guild.id);
        const serverRadio = await message.client.radio.get(message.guild.id);
        try {
            if (!song) {
                return leaveChannel(client, message, song);
            }
            var connection = await joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });
            const url = song.url
            const resource = createAudioResource(ytdl(url, { highWaterMark: 1 << 25, filter: "audioonly", quality: "highestaudio" }));
            player.play(resource);

            let songEmbed = new MessageEmbed()
                .setAuthor("Tocando agora:")
                .setColor("#0f42dc")
                .setTitle(song.title)
                .setThumbnail(song.thumbnail)
                .setURL(song.url)

            if (song.duration === '0:00' || song.liveStream) {
                songEmbed.addField("> __Duração:__", "🔴 Live", true)
                sendError("**Este video é uma live, talvez não seja possível reproduzir...**", serverQueue.textChannel)
            } else {
                songEmbed.addField("> __Duração:__", "```fix\n" + `${song.duration}` + "\n```", true)
            }
            songEmbed.addField("> __Canal:__", "```fix\n" + `${message.member.voice.channel.name ? message.member.voice.channel.name : "No provided"}` + "\n```", true)
            songEmbed.addField("> __Pedido por:___", "```fix\n" + `${song.author}` + "\n```", true)

            let mensagem = await serverQueue.textChannel.send({ embeds: [songEmbed] }).then(async (embed) => {
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
                                        embed: {
                                            color: "#701AAB",
                                            description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                        }
                                    }).then(m => m.delete({ timeout: 10000 }));
                                    await reaction.users.remove(user);
                                    return;
                                }
                                if (serverQueue.connection.channel.id !== membReact.voice.channel.id) {
                                    serverQueue.textChannel.send({
                                        embed: {
                                            color: "#701AAB",
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
                                    serverQueue.textChannel.send({
                                        embed: {
                                            color: "#701AAB",
                                            description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                        }
                                    }).then(m => m.delete({ timeout: 10000 }));
                                    await reaction.users.remove(user);
                                    return;
                                }
                                if (serverQueue.connection.channel.id !== membReact.voice.channel.id) {
                                    serverQueue.textChannel.send({
                                        embed: {
                                            color: "#701AAB",
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
                            case "⏮️":
                                if (!message.member.voice.channel) {
                                    serverQueue.textChannel.send({
                                        embed: {
                                            color: "#701AAB",
                                            description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                        }
                                    }).then(m => m.delete({ timeout: 10000 }));
                                    await reaction.users.remove(user);
                                    return;
                                }
                                if (serverQueue.connection.channel.id !== membReact.voice.channel.id) {
                                    serverQueue.textChannel.send({
                                        embed: {
                                            color: "#701AAB",
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
                                    await reaction.users.remove(user);
                                    try {
                                        if (serverQueue.prevSongs[0] == undefined || serverQueue.prevSongs[0] === null || serverQueue.prevSongs[0] === []) return sendError("Não há nenhuma música anterior.", message.channel);
                                        await serverQueue.songs.shift()
                                        await serverQueue.songs.unshift(serverQueue.prevSongs[0]);
                                        //dispatcher.end();
                                        await this.play(client, message, serverQueue.songs[0]);
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
                                        embed: {
                                            color: "#701AAB",
                                            description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                        }
                                    }).then(m => m.delete({ timeout: 10000 }));
                                    await reaction.users.remove(user);
                                    return;
                                }
                                if (serverQueue.connection.channel.id !== membReact.voice.channel.id) {
                                    serverQueue.textChannel.send({
                                        embed: {
                                            color: "#701AAB",
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
                                        if (!serverQueue.songLooping) {
                                            if (!serverQueue.songs[1]) {
                                                serverQueue.songs.shift();
                                                await dispatcher.end();
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
                                                this.play(client, message, serverQueue.songs[random]);
                                            } else {
                                                this.play(client, message, serverQueue.songs[0]);
                                            }
                                        } else {
                                            this.play(client, message, serverQueue.songs[0]);
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
                                        embed: {
                                            color: "#701AAB",
                                            description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                        }
                                    }).then(m => m.delete({ timeout: 10000 }));
                                    await reaction.users.remove(user);
                                    return;
                                }
                                if (serverQueue.connection.channel.id !== membReact.voice.channel.id) {
                                    serverQueue.textChannel.send({
                                        embed: {
                                            color: "#701AAB",
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
                                    message.client.queue.set(message.guild.id, serverQueue);
                                    await message.member.voice.channel.leave();
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
                                        embed: {
                                            color: "#701AAB",
                                            description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                        }
                                    }).then(m => m.delete({ timeout: 10000 }));
                                    await reaction.users.remove(user);
                                    return;
                                }
                                if (serverQueue.connection.channel.id !== membReact.voice.channel.id) {
                                    serverQueue.textChannel.send({
                                        embed: {
                                            color: "#701AAB",
                                            description: "❌ **O bot está sendo utilizado em outro canal!**"
                                        }
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
                                        embed: {
                                            color: "#701AAB",
                                            description: `🔁 Loop da fila de músicas ${serverQueue.looping ? `**Habilitado**` : `**Desabilitado**`}`
                                        }
                                    });
                                } catch (e) {
                                    console.log(e);
                                }
                                break;
                            case "🔂":
                                if (!message.member.voice.channel) {
                                    serverQueue.textChannel.send({
                                        embed: {
                                            color: "#701AAB",
                                            description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                        }
                                    }).then(m => m.delete({ timeout: 10000 }));
                                    await reaction.users.remove(user);
                                    return;
                                }
                                if (serverQueue.connection.channel.id !== membReact.voice.channel.id) {
                                    serverQueue.textChannel.send({
                                        embed: {
                                            color: "#701AAB",
                                            description: "❌ **O bot está sendo utilizado em outro canal!**"
                                        }
                                    }).then(m2 => m2.delete({ timeout: 10000 }))
                                    await reaction.users.remove(user);
                                    return;
                                }
                                if (!serverQueue) return;
                                try {
                                    serverQueue.songLooping = !serverQueue.songLooping
                                    await reaction.users.remove(user);
                                    return serverQueue.textChannel.send({
                                        embed: {
                                            color: "#701AAB",
                                            description: `🔂 Loop para \`${serverQueue.songs[0].title}\` ${serverQueue.songLooping ? `**Habilitado**` : `**Desabilitado**`}`
                                        }
                                    });
                                } catch (e) {
                                    console.log(e);
                                }
                                break;
                            case "🔀":
                                if (!message.member.voice.channel) {
                                    serverQueue.textChannel.send({
                                        embed: {
                                            color: "#701AAB",
                                            description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                        }
                                    }).then(m => m.delete({ timeout: 10000 }));
                                    await reaction.users.remove(user);
                                    return;
                                }
                                if (serverQueue.connection.channel.id !== membReact.voice.channel.id) {
                                    serverQueue.textChannel.send({
                                        embed: {
                                            color: "#701AAB",
                                            description: "❌ **O bot está sendo utilizado em outro canal!**"
                                        }
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
                                        embed: {
                                            color: "#701AAB",
                                            description: `🔀 Modo aleatório ${serverQueue.nigthCore ? `**Habilitado**` : `**Desabilitado**`}`
                                        }
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
            })
        } catch (e) {
            console.log(e);
            channelMain.send({
                embed: {
                    title: "Erro na source",
                    description: "*Detalhes do erro:*\n```fix\n" + `${e}` + "\n```"
                }
            });
            return;
        }
    },
    async processQueue() {
        if (player.state.status !== AudioPlayerStatus.Idle || serverQueue.songs.length === 0) {
            return;
        }
        serverQueue.prevSongs = []
        serverQueue.prevSongs.push(serverQueue.songs[0])
        if (serverQueue.nigthCore) {
            if (!serverQueue.songLooping) await serverQueue.songs.shift();
            var random = Math.floor(Math.random() * (serverQueue.songs.length));
            const newResource = createAudioResource(ytdl(random.url, { highWaterMark: 1 << 25, filter: "audioonly", quality: "highestaudio" }));
            this.play(client, message, serverQueue.songs[random], player, newResource);
        } else {
            if (serverQueue.looping) await serverQueue.songs.push(serverQueue.songs[0]);
            if (!serverQueue.songLooping) await serverQueue.songs.shift();
            this.play(client, message, serverQueue.songs[0]);
        }
    }
}