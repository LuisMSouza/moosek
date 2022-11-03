/////////////////////// IMPORTS ///////////////////////////
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { CEO_ID, CLIENT_VERSION } = require("../utils/botUtils.js");
const { Colors } = require("discord.js");

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "logs",
    description: "Mostra os logs da aplicação",
    usage: [process.env.PREFIX_KEY + "logs"],
    category: "ceo",
    timeout: 5000,
    aliases: ["terminal"],

    async execute(client, message, args) {
        if (message.author.id != CEO_ID) return;
        fetch(`https://discloud.app/status/bot/990724810210410526/logs`, {
            headers: {
                "api-token": `${process.env.API_TOKEN}`
            }
        }).then(info => info.json()).then(json => {
            message.channel.send({
                embeds: [{
                    color: Colors.Yellow,
                    description: "```js\n" + `${json.logs}` + "\n```"
                }]
            })
        })
    },
};
