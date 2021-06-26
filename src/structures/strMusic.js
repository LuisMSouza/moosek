/////////////////////// IMPORTS //////////////////////////
const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const ytdlAlt = require('ytdl-core-discord');
const ytdlAlt2 = require("discord-ytdl-core");
const sendError = require('../utils/error.js')
const guildData = require('../models/guildData.js');
const { STAY_TIME } = require('../utils/botUtils.js');
const guild_main = process.env.SERVER_MAIN
const { MessageButton, MessageActionRow } = require('discord-buttons');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    async play(client, message, song) {
        const bot = message.guild.members.cache.get(client.user.id);
        const serverMain = client.guilds.cache.get(guild_main);
        const channelMain = serverMain.channels.cache.get("807738719556993064");
        const serverQueue = await message.client.queue.get(message.guild.id);
        const serverRadio = await message.client.radio.get(message.guild.id);
        try {
            if (!song) {
                if (bot.voice.speaking) return;
                if (serverQueue.connection.dispatcher && message.guild.me.voice.channel) return;
                if (!message.guild.me.voice.channel) return;
                if (message.guild.me.voice.channel && serverQueue.songs.length >= 1) return;
                if (serverRadio) return;
                var tempo = setTimeout(async function () {
                    if (bot.voice.speaking) return;
                    if (serverQueue.connection.dispatcher && message.guild.me.voice.channel) return;
                    if (!message.guild.me.voice.channel) return;
                    if (message.guild.me.voice.channel && serverQueue.songs.length >= 1) return;
                    await guildData.findOneAndUpdate({ guildID: message.guild.id }, { $set: { aleatory_mode: false } }, { new: true });
                    await serverQueue.voiceChannel.leave();
                    serverQueue.textChannel.send({
                        embed: {
                            color: "#0f42dc",
                            description: `**Tempo de espera esgotado. Saí do chat ;)**`
                        }
                    });
                    return message.client.queue.delete(message.guild.id);
                }, STAY_TIME * 1000);
                return message.client.queue.delete(message.guild.id);
            }

            let url = song.url;
            const dispatcher = serverQueue.connection.play(await ytdl(url, { highWaterMark: 1 << 25, filter: "audioonly", quality: "highestaudio" }))
                .on("error", async error => {
                    if (error.message.includes("Video unavailable")) {
                        console.log(`[VIDEO INDISPONÍVEL] ${song.url}`);
                        sendError("**Este vídeo está indisponível.**", serverQueue.textChannel);
                        await serverQueue.songs.shift();
                        await play(guild, serverQueue.songs[0]);
                        return;
                    }
                    if (error.message.includes("Connection not established within 15 seconds.") || error.message.includes("[VOICE_CONNECTION_TIMEOUT]")) {
                        sendError("**Erro de conexão.\nTente novamente.**", serverQueue.textChannel);
                        serverQueue.voiceChannel.leave();
                        return;
                    }
                    console.log(error);
                });
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5)
            let b1 = new MessageButton()
                .setID("pause")
                .setStyle("gray")
                .setEmoji("⏸️")
            let b2 = new MessageButton()
                .setID("play")
                .setStyle("green")
                .setEmoji("▶️")
            let b3 = new MessageButton()
                .setID("skip")
                .setStyle("gray")
                .setEmoji("⏭️")
            let b4 = new MessageButton()
                .setID("stop")
                .setStyle("gray")
                .setEmoji("⏹️")
            let b5 = new MessageButton()
                .setStyle("gray")
                .setID("repeat")
                .setEmoji("🔁")
            let b6 = new MessageButton()
                .setStyle("gray")
                .setID("repeatOne")
                .setEmoji("🔂")
            let b7 = new MessageButton()
                .setStyle("gray")
                .setID("aleatory")
                .setEmoji("🔀")

            const row = new MessageActionRow()
            if (serverQueue.looping) {
                b5.setStyle('green');
                row.addComponent(b1);
                row.addComponent(b3);
                row.addComponent(b4);
                row.addComponent(b5);
                row.addComponent(b7);
            }
            if (serverQueue.songLooping) {
                b6.setStyle('green');
                row.addComponents(b1);
                row.addComponent(b3);
                row.addComponent(b4);
                row.addComponent(b6);
                row.addComponent(b7);
            }
            if (serverQueue.nigthCore) {
                b7.setStyle('green');
                row.addComponents(b1);
                row.addComponent(b3);
                row.addComponent(b4);
                row.addComponent(b5);
                row.addComponent(b7);
            }

            let songEmbed = new MessageEmbed()
                .setAuthor("Tocando agora:")
                .setColor("#0f42dc")
                .setTitle(song.title)
                .setThumbnail(song.thumbnail)
                .setURL(song.url)

            if (song.liveStream || song.duration === '0:00') {
                songEmbed.addField("> __Duração:__", "🔴 Live", true)
                sendError("**Este video é uma live, talvez não seja possível reproduzir...**", serverQueue.textChannel)
            } else {
                songEmbed.addField("> __Duração:__", "```fix\n" + `${song.duration}` + "\n```", true)
            }
            songEmbed.addField("> __Canal:__", "```fix\n" + `${message.member.voice.channel.name}` + "\n```", true)
            songEmbed.addField("> __Pedido por:___", "```fix\n" + `${song.author}` + "\n```", true)

            const mensagem = await serverQueue.textChannel.send({ embed: songEmbed, component: row })
            const filter = (button) => button.clicker.user.id != client.user.id;
            const collector = mensagem.createButtonCollector(filter);
            collector.on("collect", async (b) => {
                switch (b.id) {
                    case "pause":
                        if (!message.member.voice.channel) {
                            b.reply.send({
                                embed: {
                                    color: "#701AAB",
                                    description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                }, ephemeral: true
                            })
                            return;
                        }
                        if (serverQueue.connection.channel.id !== membReact.voice.channel.id) {
                            b.reply.send({
                                embed: {
                                    color: "#701AAB",
                                    description: "❌ **O bot está sendo utilizado em outro canal!**"
                                }, ephemeral: true
                            })
                            return;
                        }
                        if (serverQueue) {
                            try {
                                b.defer()
                                if (serverQueue.looping) {
                                    await mensagem.edit({ buttons: [b2, b3, b4, b5, b7], embed: songEmbed })
                                }
                                if (serverQueue.songLooping) {
                                    await mensagem.edit({ buttons: [b2, b3, b4, b6, b7], embed: songEmbed })
                                }
                                serverQueue.playing = false;
                                serverQueue.connection.dispatcher.pause();

                                return undefined;
                            } catch (e) {
                                console.log(e);
                            }
                        } else {
                            return undefined;
                        }
                        break
                    case "play":
                        if (!message.member.voice.channel) {
                            b.reply.send({
                                embed: {
                                    color: "#701AAB",
                                    description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                }, ephemeral: true
                            })
                            return;
                        }
                        if (serverQueue.connection.channel.id !== membReact.voice.channel.id) {
                            b.reply.send({
                                embed: {
                                    color: "#701AAB",
                                    description: "❌ **O bot está sendo utilizado em outro canal!**"
                                }, ephemeral: true
                            })
                            return;
                        }
                        if (serverQueue) {
                            try {
                                b.defer()
                                if (serverQueue.looping) {
                                    await mensagem.edit({ buttons: [b1, b3, b4, b5, b7], embed: songEmbed })
                                }
                                if (serverQueue.songLooping) {
                                    await mensagem.edit({ buttons: [b1, b3, b4, b6, b7], embed: songEmbed })
                                }
                                serverQueue.playing = true;
                                serverQueue.connection.dispatcher.resume();
                                return undefined;
                            } catch (e) {
                                console.log(e);
                            }
                        } else {
                            return undefined;
                        }

                        break
                    case "skip":
                        if (!message.member.voice.channel) {
                            b.reply.send({
                                embed: {
                                    color: "#701AAB",
                                    description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                }, ephemeral: true
                            })
                            return;
                        }
                        if (serverQueue.connection.channel.id !== membReact.voice.channel.id) {
                            b.reply.send({
                                embed: {
                                    color: "#701AAB",
                                    description: "❌ **O bot está sendo utilizado em outro canal!**"
                                }, ephemeral: true
                            })
                            return;
                        }
                        if (!serverQueue) {
                            sendError("Não há nada tocando no momento.", message.guild).then(m3 => m3.delete({ timeout: 10000 }));
                            return;
                        }
                        if (serverQueue) {
                            try {
                                if (!serverQueue.songLooping) {
                                    if (!serverQueue.songs[1]) {
                                        serverQueue.songs.shift();
                                        await mensagem.edit({ component: null, embed: songEmbed });
                                        await dispatcher.end();
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
                                        await mensagem.delete(mensagem);
                                        this.play(client, message, serverQueue.songs[random]);
                                    } else {
                                        await mensagem.delete(mensagem);
                                        this.play(client, message, serverQueue.songs[0]);
                                    }
                                } else {
                                    await mensagem.delete(mensagem);
                                    this.play(client, message, serverQueue.songs[0]);
                                }
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        break
                    case "stop":
                        if (!message.member.voice.channel) {
                            b.reply.send({
                                embed: {
                                    color: "#701AAB",
                                    description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                }, ephemeral: true
                            })
                            return;
                        }
                        if (serverQueue.connection.channel.id !== membReact.voice.channel.id) {
                            b.reply.send({
                                embed: {
                                    color: "#701AAB",
                                    description: "❌ **O bot está sendo utilizado em outro canal!**"
                                }, ephemeral: true
                            })
                            return;
                        }
                        if (!serverQueue) {
                            sendError("Não há nada tocando no momento.", message.guild).then(m3 => m3.delete({ timeout: 10000 }));
                            return;
                        }
                        try {
                            serverQueue.songs = [];
                            message.client.queue.set(message.guild.id, serverQueue);
                            await message.member.voice.channel.leave();
                            await mensagem.delete(mensagem);
                            await serverQueue.nigthCore === false
                            return;
                        } catch (e) {
                            console.log(e);
                        }
                        break
                    case "repeat":
                        if (!message.member.voice.channel) {
                            b.reply.send({
                                embed: {
                                    color: "#701AAB",
                                    description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                }, ephemeral: true
                            })
                            return;
                        }
                        if (serverQueue.connection.channel.id !== membReact.voice.channel.id) {
                            b.reply.send({
                                embed: {
                                    color: "#701AAB",
                                    description: "❌ **O bot está sendo utilizado em outro canal!**"
                                }, ephemeral: true
                            })
                            return;
                        }
                        break
                    case "repeatOne":
                        if (!message.member.voice.channel) {
                            b.reply.send({
                                embed: {
                                    color: "#701AAB",
                                    description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                }, ephemeral: true
                            })
                            return;
                        }
                        if (serverQueue.connection.channel.id !== membReact.voice.channel.id) {
                            b.reply.send({
                                embed: {
                                    color: "#701AAB",
                                    description: "❌ **O bot está sendo utilizado em outro canal!**"
                                }, ephemeral: true
                            })
                            return;
                        }
                        break
                    case "aleatory":
                        if (!message.member.voice.channel) {
                            b.reply.send({
                                embed: {
                                    color: "#701AAB",
                                    description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                }, ephemeral: true
                            })
                            return;
                        }
                        if (serverQueue.connection.channel.id !== membReact.voice.channel.id) {
                            b.reply.send({
                                embed: {
                                    color: "#701AAB",
                                    description: "❌ **O bot está sendo utilizado em outro canal!**"
                                }, ephemeral: true
                            })
                            return;
                        }
                        break
                }
            });
            dispatcher.on("finish", async () => {
                serverQueue.prevSongs = []
                serverQueue.prevSongs.push(serverQueue.songs[0])
                if (serverQueue.nigthCore) {
                    if (!serverQueue.songLooping) await serverQueue.songs.shift();
                    var random = Math.floor(Math.random() * (serverQueue.songs.length));
                    await mensagem.delete(mensagem);
                    this.play(client, message, serverQueue.songs[random]);
                } else {
                    if (serverQueue.looping) await serverQueue.songs.push(serverQueue.songs[0]);
                    if (!serverQueue.songLooping) await serverQueue.songs.shift();
                    await mensagem.delete(mensagem);
                    this.play(client, message, serverQueue.songs[0]);
                }
            })
            /*.then(async (embed) => {
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
                                        var srch = await guildData.findOne({
                                            guildID: message.guild.id
                                        });
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
                                            if (srch.aleatory_mode) {
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
                                    await guildData.findOneAndUpdate({ guildID: message.guild.id }, { $set: { aleatory_mode: false } }, { new: true });
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
                                var sgSet = await guildData.findOne({
                                    guildID: message.guild.id
                                });
                                if (sgSet.aleatory_mode) return sendError("Esta opção não pode ser ativada no modo aleatório.", message.channel);
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
                                    var sg = await guildData.findOne({
                                        guildID: message.guild.id
                                    });
                                    var isAleatory = sg.aleatory_mode;
                                    await guildData.findOneAndUpdate({ guildID: message.guild.id }, { $set: { aleatory_mode: !isAleatory } }, { new: true });
                                    var sg_2 = await guildData.findOne({
                                        guildID: message.guild.id
                                    });
                                    //if (serverQueue.looping) return sendError("Desative o Loop da fila de músicas primeiro ;)", message.channel);
                                    await reaction.users.remove(user);
                                    return serverQueue.textChannel.send({
                                        embed: {
                                            color: "#701AAB",
                                            description: `🔀 Modo aleatório ${sg_2.aleatory_mode ? `**Habilitado**` : `**Desabilitado**`}`
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
                dispatcher.on("finish", async () => {
                    serverQueue.prevSongs = []
                    serverQueue.prevSongs.push(serverQueue.songs[0])
                    const search_al = await guildData.findOne({
                        guildID: message.guild.id
                    });
                    if (search_al.aleatory_mode) {
                        if (!serverQueue.songLooping) await serverQueue.songs.shift();
                        var random = Math.floor(Math.random() * (serverQueue.songs.length));
                        this.play(client, message, serverQueue.songs[random]);
                    } else {
                        if (serverQueue.looping) await serverQueue.songs.push(serverQueue.songs[0]);
                        if (!serverQueue.songLooping) await serverQueue.songs.shift();
                        this.play(client, message, serverQueue.songs[0]);
                    }
                    embed.reactions.removeAll().catch(error => console.error('Falha ao remover as reações: ', error));
                })
            });*/
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
    }
}