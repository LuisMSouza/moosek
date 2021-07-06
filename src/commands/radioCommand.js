/////////////////////// IMPORTS //////////////////////////
const sendError = require('../utils/error.js');
const Discord = require('discord.js');
const radioStations = require('../utils/radioStations.js');
const { MessageButton, MessageActionRow, MessageMenu, MessageMenuOption } = require('discord-buttons');

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
            let op1 = new MessageMenuOption()
                .setEmoji("📻")
                .setValue("1")
                .setLabel("Standard-Radio")
            let op2 = new MessageMenuOption()
                .setEmoji("📻")
                .setValue("2")
                .setLabel("Chill-Radio")
            let op3 = new MessageMenuOption()
                .setEmoji("📻")
                .setValue("3")
                .setLabel("Greatest-hits-Radio")
            let op4 = new MessageMenuOption()
                .setEmoji("📻")
                .setValue("4")
                .setLabel("Hip-hop-Radio")
            let op5 = new MessageMenuOption()
                .setEmoji("📻")
                .setValue("5")
                .setLabel("Rádio Itatiaia")
            let op6 = new MessageMenuOption()
                .setEmoji("📻")
                .setValue("6")
                .setLabel("Rádio FM 98")
            let op7 = new MessageMenuOption()
                .setEmoji("📻")
                .setValue("7")
                .setLabel("Rádio Jovem Pan 107.3 FM")
            let op8 = new MessageMenuOption()
                .setEmoji("📻")
                .setValue("8")
                .setLabel("Rádio Alvorada FM")
            let op9 = new MessageMenuOption()
                .setEmoji("📻")
                .setValue("9")
                .setLabel("89 FM A Rádio Rock")
            let op10 = new MessageMenuOption()
                .setEmoji("📻")
                .setValue("10")
                .setLabel("Liberdade FM")
            let op11 = new MessageMenuOption()
                .setEmoji("📻")
                .setValue("11")
                .setLabel("American Road Radio")
            let op12 = new MessageMenuOption()
                .setEmoji("📻")
                .setValue("12")
                .setLabel("Classic Rock Florida")
            let op13 = new MessageMenuOption()
                .setEmoji("📻")
                .setValue("13")
                .setLabel("Rádio Z100 - 100.3 FM")
            let op14 = new MessageMenuOption()
                .setEmoji("📻")
                .setValue("14")
                .setLabel("89.7 KSGN")
            let op15 = new MessageMenuOption()
                .setEmoji("📻")
                .setValue("15")
                .setLabel("WNCI 97.9")
            const menu = new MessageMenu()
                .addOptions(op1, op2, op3, op4, op5, op6, op7, op8, op9, op10, op11, op12, op13, op14, op15)
                .setPlaceholder("Escolha sua rádio")
                .setID("menuOne")
                .setMaxValues(1)

            const msgEmb = await msg.channel.send({
                component: menu, embed: {
                    description: "> **Faça a escolha da rádio abaixo:**",
                    color: "#0f42dc"
                }
            });
            const collector = msgEmb.createMenuCollector((b) => b, { time: 300000 });
            collector.on("collect", (m) => {
                m.reply.defer();
                switch (m.values[0]) {
                    case "1":
                        await msgEmb.delete(msgEmb);
                        await initRadio(message, client, args, radioStations.radioStations[0], radioStations.radioStationsName[0])
                        break
                    case "2":
                        await msgEmb.delete(msgEmb);
                        await initRadio(message, client, args, radioStations.radioStations[1], radioStations.radioStationsName[1])
                        break
                    case "3":
                        await msgEmb.delete(msgEmb);
                        await initRadio(message, client, args, radioStations.radioStations[2], radioStations.radioStationsName[2])
                        break
                    case "4":
                        await msgEmb.delete(msgEmb);
                        await initRadio(message, client, args, radioStations.radioStations[3], radioStations.radioStationsName[3])
                        break
                    case "5":
                        await msgEmb.delete(msgEmb);
                        await initRadio(message, client, args, radioStations.radioStations[4], radioStations.radioStationsName[4])
                        break
                    case "6":
                        await msgEmb.delete(msgEmb);
                        await initRadio(message, client, args, radioStations.radioStations[5], radioStations.radioStationsName[5])
                        break
                    case "7":
                        await msgEmb.delete(msgEmb);
                        await initRadio(message, client, args, radioStations.radioStations[6], radioStations.radioStationsName[6])
                        break
                    case "8":
                        await msgEmb.delete(msgEmb);
                        await initRadio(message, client, args, radioStations.radioStations[7], radioStations.radioStationsName[7])
                        break
                    case "9":
                        await msgEmb.delete(msgEmb);
                        await initRadio(message, client, args, radioStations.radioStations[8], radioStations.radioStationsName[8])
                        break
                    case "10":
                        await msgEmb.delete(msgEmb);
                        await initRadio(message, client, args, radioStations.radioStations[9], radioStations.radioStationsName[9])
                        break
                    case "11":
                        await msgEmb.delete(msgEmb);
                        await initRadio(message, client, args, radioStations.radioStations[10], radioStations.radioStationsName[10])
                        break
                    case "12":
                        await msgEmb.delete(msgEmb);
                        await initRadio(message, client, args, radioStations.radioStations[11], radioStations.radioStationsName[11])
                        break
                    case "13":
                        await msgEmb.delete(msgEmb);
                        await initRadio(message, client, args, radioStations.radioStations[12], radioStations.radioStationsName[12])
                        break
                    case "14":
                        await msgEmb.delete(msgEmb);
                        await initRadio(message, client, args, radioStations.radioStations[13], radioStations.radioStationsName[13])
                        break
                    case "15":
                        await msgEmb.delete(msgEmb);
                        await initRadio(message, client, args, radioStations.radioStations[14], radioStations.radioStationsName[14])
                        break
                }
            })
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
                                    b.reply.send({
                                        embed: {
                                            color: "#0f42dc",
                                            description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                        }, ephemeral: true
                                    });
                                    //await reaction.users.remove(user);
                                    return;
                                }
                                if (radioListenConstruct.channel.id !== message.member.voice.channel.id) {
                                    b.reply.send({
                                        embed: {
                                            color: "#0f42dc",
                                            description: "❌ **O bot está sendo utilizado em outro canal!**"
                                        }, ephemeral: true
                                    });
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
                                    b.reply.send({
                                        embed: {
                                            color: "#0f42dc",
                                            description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                        }, ephemeral: true
                                    });
                                    //await reaction.users.remove(user);
                                    return;
                                }
                                if (radioListenConstruct.channel.id !== message.member.voice.channel.id) {
                                    b.reply.send({
                                        embed: {
                                            color: "#0f42dc",
                                            description: "❌ **O bot está sendo utilizado em outro canal!**"
                                        }, ephemeral: true
                                    });
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
                                    b.reply.send({
                                        embed: {
                                            color: "#0f42dc",
                                            description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                        }, ephemeral: true
                                    });
                                    //await reaction.users.remove(user);
                                    return;
                                }
                                if (radioListenConstruct.channel.id !== message.member.voice.channel.id) {
                                    b.reply.send({
                                        embed: {
                                            color: "#0f42dc",
                                            description: "❌ **O bot está sendo utilizado em outro canal!**"
                                        }, ephemeral: true
                                    });
                                    //await reaction.users.remove(user);
                                    return;
                                }

                                await dispatcher.resume();
                                b.defer();
                                const row3 = new MessageActionRow()
                                    .addComponents(button1, buttonStop)

                                buttonMsg.edit({ component: row3, embed: embedRadio });
                                return;
                            }
                        });
                    })
            } catch (e) {
                if (e.message === "Unknown stream type") return sendError("Radio não encontrada :(", message.channel);
                return sendError("Ocorreu um erro ao tentar executar a radio.", message.channel) && console.log(e);
            }
        }
        async function initRadio(msg, bot, args, choice, choiceName) {
            try {
                const radioListenConstruct = {
                    playing: true,
                    channel: msg.member.voice.channel,
                    author: msg.author.tag
                }
                bot.radio.set(msg.guild.id, radioListenConstruct)
                var connection = await voiceChannel.join();
                await connection.voice.setSelfDeaf(true);
                const dispatcher = await connection.play(choice, { quality: 'highestaudio' })
                    .on("start", async () => {
                        const embedRadio = new Discord.MessageEmbed()
                            .setAuthor("Tocando agora:")
                            .setColor("#e14b07")
                            .setTitle(choiceName)
                            .setThumbnail("https://cdn.discordapp.com/attachments/810261725219520564/832260730077315162/radio.png")
                            .addField("> __Canal:__", "```fix\n" + `${msg.member.voice.channel.name}` + "\n```", true)
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

                        const buttonMsg = await msg.channel.send("", {
                            component: row,
                            embed: embedRadio
                        })
                        const filter = (button) => button.clicker.user.id != bot.user.id;
                        const colletcButt = buttonMsg.createButtonCollector(filter);
                        colletcButt.on("collect", async (b) => {
                            if (b.id === "stop_radio") {
                                if (!bot.radio) return;
                                if (!msg.member.voice.channel) {
                                    b.reply.send({
                                        embed: {
                                            color: "#e14b07",
                                            description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                        }, ephemeral: true
                                    });
                                    //await reaction.users.remove(user);
                                    return;
                                }
                                if (radioListenConstruct.channel.id !== msg.member.voice.channel.id) {
                                    b.reply.send({
                                        embed: {
                                            color: "#e14b07",
                                            description: "❌ **O bot está sendo utilizado em outro canal!**"
                                        }, ephemeral: true
                                    });
                                    //await reaction.users.remove(user);
                                    return;
                                }

                                //await embed.reactions.removeAll().catch(error => console.error('Falha ao remover as reações: ', error));
                                await msg.member.voice.channel.leave();
                                await connection.disconnect();
                                await dispatcher.destroy();
                                await bot.radio.delete(msg.guild.id);
                                buttonMsg.edit({ component: button2, embed: embedRadio });
                                b.reply.defer();
                            } else if (b.id === "pause_radio") {
                                if (!bot.radio) return;
                                if (!msg.member.voice.channel) {
                                    b.reply.send({
                                        embed: {
                                            color: "#e14b07",
                                            description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                        }, ephemeral: true
                                    });
                                    //await reaction.users.remove(user);
                                    return;
                                }
                                if (radioListenConstruct.channel.id !== msg.member.voice.channel.id) {
                                    b.reply.send({
                                        embed: {
                                            color: "#e14b07",
                                            description: "❌ **O bot está sendo utilizado em outro canal!**"
                                        }, ephemeral: true
                                    });
                                    //await reaction.users.remove(user);
                                    return;
                                }

                                await dispatcher.pause();
                                const row2 = new MessageActionRow()
                                    .addComponents(button1, buttonResume)

                                buttonMsg.edit({ component: row2, embed: embedRadio });
                                b.reply.defer();
                                return;
                            } else if (b.id === "resume_radio") {
                                if (!bot.radio) return;
                                if (!msg.member.voice.channel) {
                                    b.reply.send({
                                        embed: {
                                            color: "#e14b07",
                                            description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                        }, ephemeral: true
                                    });
                                    //await reaction.users.remove(user);
                                    return;
                                }
                                if (radioListenConstruct.channel.id !== msg.member.voice.channel.id) {
                                    b.reply.send({
                                        embed: {
                                            color: "#e14b07",
                                            description: "❌ **O bot está sendo utilizado em outro canal!**"
                                        }, ephemeral: true
                                    });
                                    //await reaction.users.remove(user);
                                    return;
                                }

                                await dispatcher.resume();
                                const row3 = new MessageActionRow()
                                    .addComponents(button1, buttonStop)
                                buttonMsg.edit({ component: row3, embed: embedRadio });
                                b.reply.defer();
                                return;
                            }
                        });
                    })
            } catch (e) {
                if (e.message === "Unknown stream type") return sendError("Radio não encontrada :(", msg.channel);
                return sendError("Ocorreu um erro ao tentar executar a radio.", msg.channel) && console.log(e);
            }
        }
    }
}