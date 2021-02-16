/////////////////////// IMPORTS ///////////////////////////
const { CEO_ID } = require('../utils/botUtils.js');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "reboot",
    description: "Reiniciar a aplicação",
    usage: [process.env.PREFIX_KEY + 'reboot'],
    category: 'ceo',
    timeout: 5000,
    aliases: ['restart', 'r', 'reiniciar', 'rb'],

    async execute(client, message, args) {
        if (message.member.id != CEO_ID) return;

        const m = await message.channel.send({
            embed: {
                description: "Reiniciando..."
            }
        });
        try {
            process.exit(1);
        } catch (e) {
            console.log(e);
        }
    }
}