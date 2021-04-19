/////////////////////// IMPORTS //////////////////////////
const { MessageEmbed } = require('discord.js');
const sendError = require('../utils/error.js')

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

        const queueEmbed = await message.channel.send(
            `**\`${currentPage + 1}\`**/**${embeds.length}**`,
            embeds[currentPage]
        );

        try {
            await queueEmbed.react("⬅️");
            await queueEmbed.react("➡️");
        } catch (error) {
            console.error(error);
            message.channel.send(error.message).catch(console.error);
        }

        const filter = (reaction, user) =>
            ["⬅️", "➡️"].includes(reaction.emoji.name) && user != user.bot;
        const collector = queueEmbed.createReactionCollector(filter, { time: 300000 });

        collector.on("collect", async (reaction, user) => {
            try {
                if (reaction.emoji.name === "➡️") {
                    if (currentPage < embeds.length - 1) {
                        currentPage++;
                        queueEmbed.edit(`**\`${currentPage + 1}\`**/**${embeds.length}**`, embeds[currentPage]);
                    }
                } else if (reaction.emoji.name === "⬅️") {
                    if (currentPage !== 0) {
                        --currentPage;
                        queueEmbed.edit(`**\`${currentPage + 1}\`**/**${embeds.length}**`, embeds[currentPage]);
                    }
                }
                await reaction.users.remove(user);
            } catch (error) {
                console.error(error);
                return message.channel.send(error.message).catch(console.error);
            }
        });
        collector.on("end", async () => {
            queueEmbed.delete(queueEmbed);
        })

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