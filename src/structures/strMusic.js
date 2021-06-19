/////////////////////// IMPORTS //////////////////////////
const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
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
        try {
            const serverQueue = message.client.queue.get(message.guild.id);
            const serverRadio = message.client.radio.get(message.guild.id);
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
            let button1 = new MessageButton()
                .setStyle("green")
                .setEmoji("▶️")
                .setID("play")
            let button2 = new MessageButton()
                .setStyle("gray")
                .setEmoji("⏸️")
                .setID("pause")
            let button3 = new MessageButton()
                .setStyle("gray")
                .setEmoji("⏹️")
                .setID("stop")
            let button4 = new MessageButton()
                .setStyle("gray")
                .setEmoji("⏭️")
                .setID("skip")
            let button5 = new MessageButton()
                .setEmoji("🔁")
                .setID("repeat")
            let button6 = new MessageButton()
                .setEmoji("🔂")
                .setID("repeatOne")
            let button7 = new MessageButton()
                .setStyle("gray")
                .setEmoji("🔀")
                .setID("aleatory")
            let button8 = new MessageButton()
                .setEmoji("🔀")
                .setID("aleatoryTrue")
            var sg = await guildData.findOne({
                guildID: message.guild.id
            });
            var isAleatory = sg.aleatory_mode;
            const rowOne = new MessageActionRow()
            const rowTwo = new MessageActionRow()
            const rowThree = new MessageActionRow()
            if (serverQueue.looping) {
                await button6.setStyle("green");
                rowOne.addComponents(button2, button3, button4, button6, button7)
            } else if (!serverQueue.looping && !serverQueue.songLooping && !isAleatory) {
                await button5.setStyle("gray")
                rowOne.addComponents(button2, button3, button4, button5, button7)
            } else if (serverQueue.songLooping) {
                await button5.setStyle("green");
                rowOne.addComponents(button2, button3, button4, button5, button7)
            } else if (isAleatory) {
                await button8.setStyle("green")
                rowOne.addComponents(button2, button3, button4, button5, button8)
            }
            if (!serverQueue.playing) {
                rowTwo.addComponents(button1, button3, button4, button5, button7)
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

            const mensagem = await serverQueue.textChannel.send({ component: rowOne, embed: songEmbed })
            try {
                const filter = (button) => button.clicker.user.id != client.user.id;
                const colletcButt = mensagem.createButtonCollector(filter);
                colletcButt.on("collect", async (b) => {
                    await b.defer();
                    switch (b.id) {
                        case "pause":
                            if (!message.member.voice.channel) {
                                serverQueue.textChannel.send({
                                    embed: {
                                        color: "#0f42dc",
                                        description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                    }
                                }).then(m => m.delete({ timeout: 10000 }));
                                return;
                            }
                            if (serverQueue.connection.channel.id !== message.member.voice.channel.id) {
                                serverQueue.textChannel.send({
                                    embed: {
                                        color: "#0f42dc",
                                        description: "❌ **O bot está sendo utilizado em outro canal!**"
                                    }
                                }).then(m2 => m2.delete({ timeout: 10000 }))
                                return;
                            }
                            if (serverQueue) {
                                try {
                                    serverQueue.playing = false;
                                    serverQueue.connection.dispatcher.pause();
                                    mensagem.edit({ component: rowTwo, embed: songEmbed })
                                    return undefined;
                                } catch (e) {
                                    console.log(e);
                                }
                            } else {
                                return undefined;
                            }
                            break;
                        case "play":
                            if (!message.member.voice.channel) {
                                serverQueue.textChannel.send({
                                    embed: {
                                        color: "#0f42dc",
                                        description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                    }
                                }).then(m => m.delete({ timeout: 10000 }));
                                return;
                            }
                            if (serverQueue.connection.channel.id !== message.member.voice.channel.id) {
                                serverQueue.textChannel.send({
                                    embed: {
                                        color: "#0f42dc",
                                        description: "❌ **O bot está sendo utilizado em outro canal!**"
                                    }
                                }).then(m2 => m2.delete({ timeout: 10000 }))
                                return;
                            }
                            if (serverQueue) {
                                try {
                                    serverQueue.playing = true;
                                    serverQueue.connection.dispatcher.resume();
                                    mensagem.edit({ component: rowOne, embed: songEmbed })
                                    return undefined;
                                } catch (e) {
                                    console.log(e);
                                }
                            } else {
                                return undefined;
                            }
                            break;
                        case "stop":
                            if (!message.member.voice.channel) {
                                serverQueue.textChannel.send({
                                    embed: {
                                        color: "#0f42dc",
                                        description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                    }
                                }).then(m => m.delete({ timeout: 10000 }));
                                return;
                            }
                            if (serverQueue.connection.channel.id !== message.member.voice.channel.id) {
                                serverQueue.textChannel.send({
                                    embed: {
                                        color: "#0f42dc",
                                        description: "❌ **O bot está sendo utilizado em outro canal!**"
                                    }
                                }).then(m2 => m2.delete({ timeout: 10000 }))
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
                                await guildData.findOneAndUpdate({ guildID: message.guild.id }, { $set: { aleatory_mode: false } }, { new: true });
                                await mensagem.edit({ embed: songEmbed });
                                return;
                            } catch (e) {
                                console.log(e);
                            }
                            break;
                        case "skip":
                            if (!message.member.voice.channel) {
                                serverQueue.textChannel.send({
                                    embed: {
                                        color: "#0f42dc",
                                        description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                    }
                                }).then(m => m.delete({ timeout: 10000 }));
                                return;
                            }
                            if (serverQueue.connection.channel.id !== message.member.voice.channel.id) {
                                serverQueue.textChannel.send({
                                    embed: {
                                        color: "#0f42dc",
                                        description: "❌ **O bot está sendo utilizado em outro canal!**"
                                    }
                                }).then(m2 => m2.delete({ timeout: 10000 }))
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
                                            await mensagem.delete(mensagem);
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
                            break;
                        case "repeatOne":
                            break;
                        case "repeat":
                            break;
                        case "aleatory":
                            if (!message.member.voice.channel) {
                                serverQueue.textChannel.send({
                                    embed: {
                                        color: "#0f42dc",
                                        description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                    }
                                }).then(m => m.delete({ timeout: 10000 }));

                                return;
                            }
                            if (serverQueue.connection.channel.id !== message.member.voice.channel.id) {
                                serverQueue.textChannel.send({
                                    embed: {
                                        color: "#0f42dc",
                                        description: "❌ **O bot está sendo utilizado em outro canal!**"
                                    }
                                }).then(m2 => m2.delete({ timeout: 10000 }))

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

                                return serverQueue.textChannel.send({
                                    embed: {
                                        color: "#0f42dc",
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
        } catch (e) {
            console.log(e);
            channelMain.send({
                embed: {
                    title: "Erro na source",
                    description: "*Detalhes do erro:*\n```fix\n" + `${error}` + "\n```"
                }
            });
            return;
        }
    }
}