/////////////////////// IMPORTS //////////////////////////
const sendError = require('../utils/error.js');
const Discord = require('discord.js');
const radioStations = require('../utils/radioStations.js');
const { MessageButton, MessageActionRow } = require('discord-buttons');

/////////////////////// SOURCE CODE //////////////////////////
module.exports = {
    name: "radio",
    description: "Inicia o streaming de radio",
    usage: [process.env.PREFIX_KEY + 'radio [numero da radio na lista]'],
    category: 'user',
    timeout: 7000,
    aliases: ['r'],

    async execute(client, message, args) {
        const serverQueue = client.queue.get(message.guild.id);
        if (serverQueue) return sendError("Você deve parar a fila de músicas primeiro.", message.channel)
        const voiceChannel = message.member.voice.channel;
        const choice = args[0];
        const radioListen = client.radio.get(message.guild.id);
        if (radioListen) return sendError("**A radio já está sendo executada.**", message.channel);
        if (!choice) {
            const embedChoice = new Discord.MessageEmbed()
                .setTitle("Radios disponíveis")
                .setColor("#0f42dc")
                .setDescription("`0` - Standard-Radio\n`1` - Base-Radio(Alemã)\n`2` - Chill-Radio\n`3` - Dance-Radio\n`4` - Greatest-hits-Radio\n`5` - Hip-hop-Radio\n`6` - Party-Radio\n`7` - Us-Rap-Radio\n`8` - Greatest-hits-Radio-2\n`9` - Absolut-Radio\n`10` - Absolut-70s-Radio\n`11` - Absolut-80s-Radio\n`12` - Absolut-90s-Radio\n`13` - Absolut-2000s-Radio\n`14` - Absolut-Classic-Rock\n`15` - 88.6-Radio\n`16` - Top-Radio\n`17` - NRJ-Radio\n`18` - Color-Music-Radio\n")
                .setFooter("Para fazer a escolha digite o comando com o número da radio")

            const bt1 = new MessageButton()
                .setEmoji("🌐")
                .setStyle("gray")
                .setID("button_radio_global")

            const bt2 = new MessageButton()
                .setEmoji("🇧🇷")
                .setStyle("gray")
                .setID("button_radio_br")

            const bt3 = new MessageButton()
                .setEmoji("🇺🇸")
                .setStyle("gray")
                .setID("button_radio_usa")

            const msgButtons = new MessageActionRow()
                .addComponent(bt1)
                .addComponent(bt2)
                .addComponent(bt3)

            const msgEmb = await message.channel.send({ component: msgButtons, embed: embedChoice })
            const filter = (button) => button.clicker.user.id != client.user.id;
            const colletcButt = msgEmb.createButtonCollector(filter);
            colletcButt.on("collect", (b) => {
                if (b.id === "button_radio_global") {
                    const embedAll = new Discord.MessageEmbed()
                        .setTitle("Radios disponíveis")
                        .setColor("#0f42dc")
                        .setDescription("`0` - Standard-Radio\n`1` - Base-Radio(Alemã)\n`2` - Chill-Radio\n`3` - Dance-Radio\n`4` - Greatest-hits-Radio\n`5` - Hip-hop-Radio\n`6` - Party-Radio\n`7` - Us-Rap-Radio\n`8` - Greatest-hits-Radio-2\n`9` - Absolut-Radio\n`10` - Absolut-70s-Radio\n`11` - Absolut-80s-Radio\n`12` - Absolut-90s-Radio\n`13` - Absolut-2000s-Radio\n`14` - Absolut-Classic-Rock\n`15` - 88.6-Radio\n`16` - Top-Radio\n`17` - NRJ-Radio\n`18` - Color-Music-Radio\n")
                        .setFooter("Para fazer a escolha digite o comando com o número da radio")
                    b.defer()
                    msgEmb.edit({ component: msgButtons, embed: embedAll });
                } else if (b.id === "button_radio_br") {
                    const embedBr = new Discord.MessageEmbed()
                        .setTitle("Radios disponíveis")
                        .setColor("#0f42dc")
                        .setDescription("`19` - Rádio Itatiaia\n`20` - Rádio FM 98\n`21` - Rádio Jovem Pan 107.3 FM\n`22` - Rádio Alvorada FM\n`23` - 89 FM A Rádio Rock\n`24` - Liberdade FM")
                        .setFooter("Para fazer a escolha digite o comando com o número da radio")
                    b.defer()
                    msgEmb.edit({ component: msgButtons, embed: embedBr });
                } else if (b.id === "button_radio_usa") {
                    const embedUs = new Discord.MessageEmbed()
                        .setTitle("Radios disponíveis")
                        .setColor("#0f42dc")
                        .setDescription("`25` - American Road Radio\n`26` - Classic Rock Florida\n`27` - Rádio Z100 - 100.3 FM\n`28` - 89.7 KSGN\n`29` - WNCI 97.9")
                        .setFooter("Para fazer a escolha digite o comando com o número da radio")
                    b.defer()
                    msgEmb.edit({ component: msgButtons, embed: embedUs });
                }
            })
            /*.then(async (embed) => {
                try {
                    await embed.react("🌐");
                    await embed.react("🇧🇷");
                    await embed.react("🇺🇸");
                    const collector = embed.createReactionCollector((reaction, user) => ["🌐", "🇧🇷", "🇺🇸"].includes(reaction.emoji.name) && user != user.bot);
                    collector.on("collect", async (reaction, user) => {
                        var membReact = message.guild.members.cache.get(user.id);
                        switch (reaction.emoji.name) {
                            case "🌐":
                                const embedAll = new Discord.MessageEmbed()
                                    .setTitle("Radios disponíveis")
                                    .setColor("#0f42dc")
                                    .setDescription("`0` - Standard-Radio\n`1` - Base-Radio(Alemã)\n`2` - Chill-Radio\n`3` - Dance-Radio\n`4` - Greatest-hits-Radio\n`5` - Hip-hop-Radio\n`6` - Party-Radio\n`7` - Us-Rap-Radio\n`8` - Greatest-hits-Radio-2\n`9` - Absolut-Radio\n`10` - Absolut-70s-Radio\n`11` - Absolut-80s-Radio\n`12` - Absolut-90s-Radio\n`13` - Absolut-2000s-Radio\n`14` - Absolut-Classic-Rock\n`15` - 88.6-Radio\n`16` - Top-Radio\n`17` - NRJ-Radio\n`18` - Color-Music-Radio\n")
                                    .setFooter("Para fazer a escolha digite o comando com o número da radio")
                                embed.edit(embedAll);
                                await reaction.users.remove(user);
                                break;
                            case "🇧🇷":
                                const embedBBr = new Discord.MessageEmbed()
                                    .setTitle("Radios disponíveis")
                                    .setColor("#0f42dc")
                                    .setDescription("`19` - Rádio Itatiaia\n`20` - Rádio FM 98\n`21` - Rádio Jovem Pan 107.3 FM\n`22` - Rádio Alvorada FM\n`23` - 89 FM A Rádio Rock")
                                    .setFooter("Para fazer a escolha digite o comando com o número da radio")
                                embed.edit(embedBBr);
                                await reaction.users.remove(user);
                                break;
                            case "🇺🇸":
                                const embedBUs = new Discord.MessageEmbed()
                                    .setTitle("Radios disponíveis")
                                    .setColor("#0f42dc")
                                    .setDescription("`24` - American Road Radio\n`25` - Classic Rock Florida\n`26` - Rádio Z100 - 100.3 FM\n`27` - 89.7 KSGN\n`28` - WNCI 97.9")
                                    .setFooter("Para fazer a escolha digite o comando com o número da radio")
                                embed.edit(embedBUs);
                                await reaction.users.remove(user);
                                break;
                        }
                    });
                } catch (err) {
                    if (err.message === "Unknown stream type") return sendError("Radio não encontrada :(", message.channel);
                    console.log(err)
                }
            });*/
        } else {
            var isNum = Number(choice);
            if (!Number.isInteger(isNum)) return sendError("Indique o número da radio que deseja.", message.channel);
            if (choice > radioStations.radioStations.length) return sendError("Não há nenhuma radio correspondente", message.channel);
            if (isNaN(choice)) return sendError("Indique o número da radio que deseja.", message.channel);
            if (!voiceChannel) return sendError("Você precisa estar em um canal de voz para iniciar a radio!", message.channel);
            const permissions = voiceChannel.permissionsFor(message.client.user);
            if (!permissions.has("CONNECT")) return sendError("Eu não teho permissões para conectar nesse canal :(", message.channel).then(m2 => m2.delete({ timeout: 10000 }));
            if (!permissions.has("SPEAK")) return sendError("Eu não teho permissões para falar nesse canal :(", message.channel).then(m3 => m3.delete({ timeout: 10000 }));

            const radioListenConstruct = {
                playing: true,
                channel: message.member.voice.channel,
                author: message.author.tag
            }
            client.radio.set(message.guild.id, radioListenConstruct)

            try {
                var connection = await voiceChannel.join();
                await connection.voice.setSelfDeaf(true);
                const dispatcher = await connection.play(radioStations.radioStations[choice], { quality: 'highestaudio' })
                    .on("start", async () => {
                        const embedRadio = new Discord.MessageEmbed()
                            .setAuthor("Tocando agora:")
                            .setColor("#0f42dc")
                            .setTitle(radioStations.radioStationsName[choice])
                            .setThumbnail("https://cdn.discordapp.com/attachments/810261725219520564/832260730077315162/radio.png")
                            .addField("> __Canal:__", "```fix\n" + `${message.member.voice.channel.name}` + "\n```", true)
                            .addField("> __Pedido por:___", "```fix\n" + `${radioListenConstruct.author}` + "\n```", true)

                        const button1 = new MessageButton()
                            .setStyle("red")
                            .setID("stop_radio")
                            .setLabel("PARAR RADIO")

                        const buttonStop = new MessageButton()
                            .setStyle("red")
                            .setID("pause_radio")
                            .setLabel("PAUSAR RADIO")

                        const buttonResume = new MessageButton()
                            .setStyle("green")
                            .setID("resume_radio")
                            .setLabel("RESUMIR RADIO")

                        const button2 = new MessageButton()
                            .setStyle("red")
                            .setID("smart")
                            .setLabel("RADIO FINALIZADA")
                            .setDisabled()

                        const row = new MessageActionRow()
                            .addComponents(button1, buttonStop)

                        const buttonMsg = await message.channel.send("", {
                            component: row,
                            embed: embedRadio
                        })
                        const filter = (button) => button.clicker.user.id != client.user.id;
                        const colletcButt = buttonMsg.createButtonCollector(filter);
                        colletcButt.on("collect", async (b) => {
                            if (b.id === "stop_radio") {
                                if (!client.radio) return;
                                if (!message.member.voice.channel) {
                                    message.channel.send({
                                        embed: {
                                            color: "#0f42dc",
                                            description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                        }
                                    }).then(m => m.delete({ timeout: 10000 }));
                                    //await reaction.users.remove(user);
                                    return;
                                }
                                if (radioListenConstruct.channel.id !== message.member.voice.channel.id) {
                                    message.channel.send({
                                        embed: {
                                            color: "#0f42dc",
                                            description: "❌ **O bot está sendo utilizado em outro canal!**"
                                        }
                                    }).then(m2 => m2.delete({ timeout: 10000 }))
                                    //await reaction.users.remove(user);
                                    return;
                                }

                                //await embed.reactions.removeAll().catch(error => console.error('Falha ao remover as reações: ', error));
                                await message.member.voice.channel.leave();
                                await connection.disconnect();
                                await dispatcher.destroy();
                                await client.radio.delete(message.guild.id);
                                b.defer(true)
                                buttonMsg.edit({ component: button2, embed: embedRadio });
                                return
                            } else if (b.id === "pause_radio") {
                                if (!client.radio) return;
                                if (!message.member.voice.channel) {
                                    message.channel.send({
                                        embed: {
                                            color: "#0f42dc",
                                            description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                        }
                                    }).then(m => m.delete({ timeout: 10000 }));
                                    //await reaction.users.remove(user);
                                    return;
                                }
                                if (radioListenConstruct.channel.id !== message.member.voice.channel.id) {
                                    message.channel.send({
                                        embed: {
                                            color: "#0f42dc",
                                            description: "❌ **O bot está sendo utilizado em outro canal!**"
                                        }
                                    }).then(m2 => m2.delete({ timeout: 10000 }))
                                    //await reaction.users.remove(user);
                                    return;
                                }

                                await dispatcher.pause();
                                b.defer();
                                const row2 = new MessageActionRow()
                                    .addComponents(button1, buttonResume)

                                buttonMsg.edit({ component: row2, embed: embedRadio });
                                return;
                            } else if (b.id === "resume_radio") {
                                if (!client.radio) return;
                                if (!message.member.voice.channel) {
                                    message.channel.send({
                                        embed: {
                                            color: "#0f42dc",
                                            description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                        }
                                    }).then(m => m.delete({ timeout: 10000 }));
                                    //await reaction.users.remove(user);
                                    return;
                                }
                                if (radioListenConstruct.channel.id !== message.member.voice.channel.id) {
                                    message.channel.send({
                                        embed: {
                                            color: "#0f42dc",
                                            description: "❌ **O bot está sendo utilizado em outro canal!**"
                                        }
                                    }).then(m2 => m2.delete({ timeout: 10000 }))
                                    //await reaction.users.remove(user);
                                    return;
                                }

                                await dispatcher.pause();
                                b.defer();
                                const row3 = new MessageActionRow()
                                    .addComponents(button1, buttonStop)

                                buttonMsg.edit({ component: row3, embed: embedRadio });
                                return;
                            }
                        });
                        /*await message.channel.send(embedRadio).then(async (embed) => {
                            try {
                                await embed.react("⏹️");
                                const collector = embed.createReactionCollector((reaction, user) => ["⏹️"].includes(reaction.emoji.name) && user != user.bot);
                                collector.on("collect", async (reaction, user) => {
                                    var membReact = message.guild.members.cache.get(user.id);
                                    switch (reaction.emoji.name) {
                                        case "⏹️":
                                            if (!message.member.voice.channel) {
                                                message.channel.send({
                                                    embed: {
                                                        color: "#0f42dc",
                                                        description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                                    }
                                                }).then(m => m.delete({ timeout: 10000 }));
                                                await reaction.users.remove(user);
                                                return;
                                            }
                                            if (radioListenConstruct.channel.id !== membReact.voice.channel.id) {
                                                message.channel.send({
                                                    embed: {
                                                        color: "#0f42dc",
                                                        description: "❌ **O bot está sendo utilizado em outro canal!**"
                                                    }
                                                }).then(m2 => m2.delete({ timeout: 10000 }))
                                                await reaction.users.remove(user);
                                                return;
                                            }

                                            await embed.reactions.removeAll().catch(error => console.error('Falha ao remover as reações: ', error));
                                            await message.member.voice.channel.leave();
                                            await connection.disconnect();
                                            await dispatcher.destroy();
                                            await client.radio.delete(message.guild.id);
                                            return
                                            break;
                                    }
                                });
                            } catch (err) {
                                console.log(err)
                            }
                        });*/
                    })
            } catch (e) {
                if (e.message === "Unknown stream type") return sendError("Radio não encontrada :(", message.channel);
                return sendError("Ocorreu um erro ao tentar executar a radio.", message.channel) && console.log(e);
            }
        }
    }
}