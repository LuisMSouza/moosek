/////////////////////// IMPORTS //////////////////////////
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { CEO_ID } = require('../utils/botUtils.js');

/////////////////////// SOURCE CODE //////////////////////////
module.exports = {
    name: "reiniciar",
    description: "Reinicia o bot",
    usage: [process.env.PREFIX_KEY + 'reiniciar'],
    category: 'ceo',
    timeout: 7000,
    aliases: ['rb'],

    async execute(client, message, args) {
        if (message.author.id != CEO_ID) return;
        await message.reply({
            embeds: [
                {
                    color: "YELLOW",
                    description: "```\nBot reiniciado!\n```"
                }
            ]
        });
        fetch(`https://discloud.app/status/bot/778462497728364554/restart`, {
            method: 'POST',
            headers: {
                "api-token": "DQl90nQTPADiqzdwlEuDMQMPXWTWnaGmCKvoIDVNuWy8PC66ARtT0PoyUkCwVs"
            }
        }).then(info => info.json()).then(async json => {
        });
    }
}