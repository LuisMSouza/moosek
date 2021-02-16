/////////////////////// IMPORTS ///////////////////////////
const { CEO_ID } = require('../utils/botUtils.js');
const process = require('child_process');

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
            process.exec('heroku ps:restart --app moosek')
        } catch (e) {
            console.log(e);
        }
    }
}