/////////////////////// IMPORTS //////////////////////////
const sendError = require('../utils/error.js');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "fila",
    description: "Para ver a fila de músicas do servidor",
    usage: [process.env.PREFIX_KEY + 'fila'],
    category: 'user',
    timeout: 7000,
    aliases: ['queue', 'q', 'f', 'lista'],
    options: [{
        name: "none",
        description: "NONE",
        type: "STRING",
        required: true
    }],

    async execute(client, message, args) {
        const serverQueue = client.queue.get(message.guild.id);

        if (!serverQueue) return sendError("Não há nenhuma música sendo reproduzida.", message.channel)

        let currentPage = 0;
        const embeds = generateQueueEmbed(message, serverQueue.songs);

        let bt1 = new MessageButton()
            .setStyle("SUCCESS")
            .setCustomId("queue_next")
            .setEmoji("➡️")
        let bt1b = new MessageButton()
            .setStyle("SUCCESS")
            .setCustomId("queue_next")
            .setEmoji("➡️")
        let bt2 = new MessageButton()
            .setStyle("SUCCESS")
            .setCustomId("queue_prev")
            .setEmoji("⬅️")
        let bt2b = new MessageButton()
            .setStyle("SUCCESS")
            .setCustomId("queue_prev")
            .setEmoji("⬅️")
        let bt3 = new MessageButton()
            .setStyle("SECONDARY")
            .setDisabled()
            .setCustomId("queue_num")
            .setLabel(`${currentPage + 1}/${embeds.length}`)

        if (embeds.length <= 1) {
            bt1.setDisabled()
            bt2.setDisabled()
        }
        bt2.setDisabled()

        var buttonRow = new MessageActionRow()
            .addComponents([bt2, bt3, bt1])

        const queueEmbed = await message.channel.send({ components: [buttonRow], embeds: [embeds[currentPage]] });

        const filter = (button) => button.user.id != client.user.id;
        const collector = queueEmbed.channel.createMessageComponentCollector({ filter, time: 300000 });

        collector.on('collect', async (b) => {
            try {
                if (b.customId === "queue_next") {
                    if (currentPage < embeds.length - 1) {
                        currentPage++;
                        await bt3.setLabel(`${currentPage + 1}/${embeds.length}`)
                        var buttonRow2 = new MessageActionRow()
                        if (currentPage + 1 === embeds.length) {
                            bt1.setDisabled()
                            buttonRow2.addComponents([bt2b, bt3, bt1])
                        } else if (currentPage + 1 === 1) {
                            bt2.setDisabled()
                            buttonRow2.addComponents([bt2, bt3, bt1b])
                        } else {
                            buttonRow2.addComponents([bt2b, bt3, bt1b])
                        }
                        await b.update({ components: [buttonRow2], embeds: [embeds[currentPage]] });
                    }
                } else if (b.customId === "queue_prev") {
                    if (currentPage !== 0) {
                        --currentPage;
                        await bt3.setLabel(`${currentPage + 1}/${embeds.length}`)
                        var buttonRow3 = new MessageActionRow()
                        if (currentPage + 1 === embeds.length) {
                            bt1.setDisabled()
                            buttonRow3.addComponents([bt2, bt3, bt1])
                        } else if (currentPage + 1 === 1) {
                            bt2.setDisabled()
                            buttonRow3.addComponents([bt2, bt3, bt1b])
                        } else {
                            buttonRow3.addComponents([bt2b, bt3, bt1b])
                        }
                        await b.update({ components: [buttonRow3], embeds: [embeds[currentPage]] });
                    }
                }
            } catch (err) {
                if (err.message.includes("DiscordAPIError: Unknown interaction")) return
                console.log(err);
            }
            return;
        });
        collector.on('end', async (collected) => {
            await queueEmbed.delete(queueEmbed).catch(e => console.log(e));
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
                    .addField("Canal de texto", `${serverQueue.textChannel}`, true)
                    .addField("Canal de voz", `${serverQueue.voiceChannel}`, true)
                //.setFooter(`${message.guild.name}`, `${message.guild.iconURL()}`)
                if (serverQueue.songs.length === 1) embed.setDescription(`Sem músicas na fila. Adicione mais digitando: .play <nome da música>`)

                embeds.push(embed);
            }

            return embeds;

        };
    }
}
