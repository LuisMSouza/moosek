/////////////////////// IMPORTS //////////////////////////
const sendError = require('../utils/error.js');
const { CEO_ID } = require('../utils/botUtils.js');
const guildData = require('../models/guildData.js');

/////////////////////// SOURCE CODE //////////////////////////
module.exports = {
    name: "announce",
    description: "Faz um anúncio a todos os servidores em que o bot está",
    usage: [process.env.PREFIX_KEY + 'announce'],
    category: 'ceo',
    timeout: 7000,
    aliases: ['anc', 'msgall', 'msg'],

    async execute(client, message, args) {
        if (message.author.id != CEO_ID) return;

        const data = await guildData.find({});
        data.forEach(async function (c) {
            const guild = c.guildID;
            console.log(guild)
        })
    }
}