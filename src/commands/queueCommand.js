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

        const bt1 = new MessageButton()
            .setStyle("green")
            .setID("queue_next")
            .setEmoji("➡️")
        const bt2 = new MessageButton()
            .setStyle("green")
            .setID("queue_prev")
            .setEmoji("⬅️")
        const bt3 = new MessageButton()
            .setStyle("gray")
            .setDisabled()
            .setID("queue_num")
            .setLabel(`${currentPage + 1}/${embeds.length}`)

        const buttonRow = new MessageActionRow()
            .addComponents([bt2, bt3, bt1])

        const queueEmbed = await message.channel.send({ component: buttonRow, embed: embeds[currentPage] });

        const filter = (button) => button.clicker.user.id != client.user.id;
        const collector = queueEmbed.createButtonCollector(filter, { time: 300000 });

        collector.on('collect', async (b) => {
            if (b.id === "queue_next") {
                if (currentPage < embeds.length - 1) {
                    currentPage++;
                    await bt3.setLabel(`${currentPage + 1}/${embeds.length}`)
                    queueEmbed.edit({ component: buttonRow, embed: embeds[currentPage] });
                    b.defer();
                }
            } else if (b.id === "queue_prev") {
                if (currentPage !== 0) {
                    --currentPage;
                    await bt3.setLabel(`${currentPage + 1}/${embeds.length}`)
                    queueEmbed.edit({ component: buttonRow, embed: embeds[currentPage] });
                    b.defer();
                }
            }
        });

        function generateQueueEmbed(message, queue) {
            let embeds = [];
            let k = 10;

            for (let i = 0; i < queue.length; i += 10) {
                const current = queue.slice(i, k);
                let j = i;
                k += 10;

                const info = current.map((track) => `**\`${++j}\`** | [\`${track.title}\`](${track.url})`).join("\n");

                let emoji1 = message.client.guilds.cache.get('731542666277290016').emojis.cache.find(emoji => emoji.name === "9416_script");
                const serverQueue = message.client.queue.get(message.guild.id);
                const embed = new MessageEmbed()
                    .setTitle(`${emoji1} Fila de músicas do servidor`)
                    .setColor("#701AAB")
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