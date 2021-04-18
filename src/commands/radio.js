/////////////////////// IMPORTS //////////////////////////
const sendError = require('../utils/error.js');
const Discord = require('discord.js');
const radioStations = require('../utils/radioStations.js');

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
                .setColor("#701AAB")
                .setDescription("`0` - Standard-Radio\n`1` - Base-Radio(Alemã)\n`2` - Chill-Radio\n`3` - Dance-Radio\n`4` - Greatest-hits-Radio\n`5` - Hip-hop-Radio\n`6` - Party-Radio\n`7` - Us-Rap-Radio\n`8` - Greatest-hits-Radio-2\n`9` - Absolut-Radio\n`10` - Absolut-70s-Radio\n`11` - Absolut-80s-Radio\n`12` - Absolut-90s-Radio\n`13` - Absolut-2000s-Radio\n`14` - Absolut-Classic-Rock\n`15` - 88.6-Radio\n`16` - Top-Radio\n`17` - NRJ-Radio\n`18` - Color-Music-Radio\n")
                .setFooter("Para fazer a escolha digite o comando com o número da radio")

            message.channel.send(embedChoice).then(async (embed) => {
                try {
                    await embed.react("🇧🇷");
                    await embed.react("🇺🇸");
                    const collector = embed.createReactionCollector((reaction, user) => ["🇧🇷", "🇺🇸"].includes(reaction.emoji.name) && user != user.bot);
                    collector.on("collect", async (reaction, user) => {
                        var membReact = message.guild.members.cache.get(user.id);
                        switch (reaction.emoji.name) {
                            case "🇧🇷":
                                const embedBBr = new Discord.MessageEmbed()
                                    .setTitle("Radios disponíveis")
                                    .setColor("#701AAB")
                                    .setDescription("`21` - Rádio Itatiaia\n`22` - Rádio FM 98\n`23` - Rádio Jovem Pan 107.3 FM")
                                    .setFooter("Para fazer a escolha digite o comando com o número da radio")
                                embed.edit(embedBBr);
                                await reaction.users.remove(user);
                                break;
                            case "🇺🇸":
                                const embedBUs = new Discord.MessageEmbed()
                                    .setTitle("Radios disponíveis")
                                    .setColor("#701AAB")
                                    .setDescription("`24` - American Road Radio\n`25` - Classic Rock Florida\n`26` - Rádio Z100 - 100.3 FM")
                                    .setFooter("Para fazer a escolha digite o comando com o número da radio")
                                embed.edit(embedBUs);
                                await reaction.users.remove(user);
                                break;
                        }
                    });
                } catch (err) {
                    console.log(err)
                }
            });
        } else {
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
                const dispatcher = await connection.play(radioStations.radioStations[choice])
                    .on("start", async () => {
                        const embedRadio = new Discord.MessageEmbed()
                            .setAuthor("Tocando agora:")
                            .setColor("#701AAB")
                            .setTitle(radioStations.radioStationsName[choice])
                            .setThumbnail("https://cdn.discordapp.com/attachments/810261725219520564/832260730077315162/radio.png")
                            .addField("> __Canal:__", "```fix\n" + `${message.member.voice.channel.name}` + "\n```", true)
                            .addField("> __Pedido por:___", "```fix\n" + `${radioListenConstruct.author}` + "\n```", true)

                        await message.channel.send(embedRadio).then(async (embed) => {
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
                                                        color: "#701AAB",
                                                        description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                                                    }
                                                }).then(m => m.delete({ timeout: 10000 }));
                                                await reaction.users.remove(user);
                                                return;
                                            }
                                            if (radioListenConstruct.channel.id !== membReact.voice.channel.id) {
                                                message.channel.send({
                                                    embed: {
                                                        color: "#701AAB",
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
                        });
                    })
            } catch (e) {
                return sendError("Ocorreu um erro ao tentar executar a radio.", message.channel) && console.log(e);
            }
        }
    }
}