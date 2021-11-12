/////////////////////// IMPORTS //////////////////////////
const sendError = require('../utils/error.js');
const { CEO_ID } = require('../utils/botUtils.js');

/////////////////////// SOURCE CODE //////////////////////////
module.exports = {
    name: "reboot",
    description: "Reinicia o bot",
    usage: [process.env.PREFIX_KEY + 'reboot'],
    category: 'ceo',
    timeout: 7000,
    aliases: ['rb'],

    async execute(client, message, args) {
        const emoji = client.guilds.cache.get("731542666277290016").emojis.cache.find(emj => emj.name === "7041_loading");
        if (message.author.id != CEO_ID) return;

        var msg = await message.channel.send({ content: `${emoji}` });

        try {
            setTimeout(async () => {
                await msg.delete(msg);
                await message.channel.send({
                    embeds: [
                        {
                            color: "#2592b0",
                            description: "```\nBot reiniciado!\n```"
                        }
                    ]
                });
                process.exit(1);
            }, 5000);
        } catch (e) {
            return sendError("Ocorreu um erro ao reiniciar o bot.", message.channel)
        }
    }
}