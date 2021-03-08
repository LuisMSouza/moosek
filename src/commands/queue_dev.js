////////////////// IMPORTS //////////////////////
const sendError = require('../utils/error.js');
const { CEO_ID, PB_USER, PB_PASS } = require('../utils/botUtils.js');
var paste = require("better-pastebin");
paste.setDevKey(process.env.PB_KEY);

////////////////// SOURCE CODE //////////////////
module.exports = {
    name: "queuedev",
    description: "",
    usage: [process.env.PREFIX_KEY + 'queuedev'],
    category: 'ceo',
    timeout: 7000,
    aliases: ['qd'],

    async execute(client, message, args) {
        await message.delete()
        const guildID = args[0];
        if (!guildID) return;
        const emoji = client.guilds.cache.get("731542666277290016").emojis.cache.find(emj => emj.name === "7041_loading");
        if (message.author.id != CEO_ID) return;

        var msg = await message.channel.send(`${emoji}`);

        try {
            setTimeout(async () => {
                await msg.delete(msg);
                paste.login(PB_USER, PB_PASS, async function (success, data) {
                    if (!success) {
                        console.log("Failed (" + data + ")");
                        return false;
                    }
                    const queue_list = await client.queue.get(guildID);
                    paste.create({
                        contents: `${queue_list}`,
                        name: `ServerQueue (${guildID})`,
                        privacy: "2"
                    }, async function (success, data) {
                        if (success) {
                            await message.author.send({
                                embed: {
                                    title: `ServerQueue (${guildID})`,
                                    description: "```css\n" + data + "\n```"
                                }
                            })
                        } else {
                            return sendError("Ocorreu um erro ao tentar criar a pasta.")
                        }
                    });
                });
            }, 5000)
        } catch (e) {

        }
    }
}