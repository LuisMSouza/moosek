/////////////////////// IMPORTS //////////////////////////
const { MessageEmbed } = require('discord.js');
const sendError = require('../utils/error.js');
const { MessageButton, MessageActionRow } = require('discord-buttons');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "fila",
    description: "Para ver a fila de músicas do servidor",
    usage: [process.env.PREFIX_KEY + 'fila'],
    category: 'user',
    timeout: 7000,
    aliases: ['queue', 'q', 'f', 'lista'],

    async execute(client, message, args) {
        const serverQueue = client.queue.get(message.guild.id);

        if (!serverQueue) return sendError("Não há nenhuma música sendo reproduzida.", message.channel)

        let currentPage = 0;
        const embeds = generateQueueEmbed(message, serverQueue.songs);

        let bt1 = new MessageButton()
            .setStyle("green")
            .setID("queue_next")
            .setEmoji("➡️")
        let bt1b = new MessageButton()
            .setStyle("green")
            .setID("queue_next")
            .setEmoji("➡️")
        let bt2 = new MessageButton()
            .setStyle("green")
            .setID("queue_prev")
            .setEmoji("⬅️")
        let bt2b = new MessageButton()
            .setStyle("green")
            .setID("queue_prev")
            .setEmoji("⬅️")
        let bt3 = new MessageButton()
            .setStyle("gray")
            .setDisabled()
            .setID("queue_num")
            .setLabel(`${currentPage + 1}/${embeds.length}`)

        if (embeds.length <= 1) {
            bt1.setDisabled()
            bt2.setDisabled()
        }

        var buttonRow = new MessageActionRow()
            .addComponents([bt2, bt3, bt1])

        const queueEmbed = await message.channel.send({ component: buttonRow, embed: embeds[currentPage] });

        const filter = (button) => button.clicker.user.id != client.user.id;
        const collector = queueEmbed.createButtonCollector(filter, { time: 300000 });

        collector.on('collect', async (b) => {
            try {
                if (b.id === "queue_next") {
                    if (currentPage < embeds.length - 1) {
                        currentPage++;
                        await bt3.setLabel(`${currentPage + 1}/${embeds.length}`)
                        var buttonRow2 = new MessageActionRow()
                        if (currentPage === embeds.length) {
                            bt1.setDisabled()
                            buttonRow2.addComponents([bt2, bt3, bt1])
                        } else if (currentPage === 1) {
                            bt2.setDisabled()
                            buttonRow2.addComponents([bt2, bt3, bt1])
                        } else {
                            buttonRow2.addComponent([bt2b, bt3, bt1b])
                        }
                        queueEmbed.edit({ component: buttonRow2, embed: embeds[currentPage] });
                        b.defer();
                    }
                    b.defer();
                } else if (b.id === "queue_prev") {
                    if (currentPage !== 0) {
                        --currentPage;
                        await bt3.setLabel(`${currentPage + 1}/${embeds.length}`)
                        var buttonRow3 = new MessageActionRow()
                        if (currentPage === embeds.length) {
                            bt1.setDisabled()
                            buttonRow3.addComponents([bt2, bt3, bt1])
                        } else if (currentPage === 1) {
                            bt2.setDisabled()
                            buttonRow3.addComponents([bt2, bt3, bt1])
                        } else {
                            buttonRow3.addComponent([bt2b, bt3, bt1b])
                        }
                        queueEmbed.edit({ component: buttonRow3, embed: embeds[currentPage] });
                        b.defer();
                    }
                    b.defer();
                }
                b.defer();
            } catch (err) {
                if (err.message.includes("DiscordAPIError: Unknown interaction")) return
            }
            return;
        });
        collector.on('end', async (collected) => {
            await queueEmbed.delete(queueEmbed);
            return;
        })

        function generateQueueEmbed(message, queue) {
            let embeds = [];
            let k = 10;

            for (let i = 0; i < queue.length; i += 10) {
                const current = queue.slice(i, k);
                let j = i;
                k += 10;

                const info = current.map((track) => `**\`${++j}\`** | [\`${track.title}\`](${track.url})`).join("\n");

                const serverQueue = message.client.queue.get(message.guild.id);
                const embed = new MessageEmbed()
                    .setTitle(`Fila de músicas do servidor`)
                    .setColor("#0f42dc")
                    .setThumbnail(message.guild.iconURL())
                    .setDescription(`${info}`)
                    .addField("Tocando agora", `[${queue[0].title}](${queue[0].url})`, true)
                    .addField("Canal de texto", serverQueue.textChannel, true)
                    .addField("Canal de voz", serverQueue.voiceChannel, true)
                //.setFooter(`${message.guild.name}`, `${message.guild.iconURL()}`)
                if (serverQueue.songs.length === 1) embed.setDescription(`Sem músicas na fila. Adicione mais digitando: .play <nome da música>`)

                embeds.push(embed);
            }

            return embeds;

        };
    }
}
