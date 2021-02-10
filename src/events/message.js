/////////////////////// IMPORTS //////////////////////////
const ms = require('ms');
const sendError = require('../utils/error.js');
const guildData = require('../models/guildData.js');

/////////////////////// SOURCE CODE //////////////////////////
module.exports = async (client, message) => {
    const args = message.content.split(/ +/g);
    const commandName = args.shift().slice((await guildData.findOne({ guildID: message.guild.id })).guildPrefix).toLowerCase();
    const cmd = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!message.content.toLowerCase().startsWith((await guildData.findOne({ guildID: message.guild.id }))) || !message.guild || message.author.bot) return;

    try {
        if (cmd) {
            if (cmd.timeout) {
                if (client.timeout.has(`${cmd.name}${message.author.id}`)) return sendError(`Aguarde \`${ms(client.timeout.get(`${cmd.name}${message.author.id}`) - Date.now(), { long: true })}\` para usar esse comando novamente.`, message.channel)
                cmd.execute(client, message, args);
                client.timeout.set(`${cmd.name}${message.author.id}`, Date.now() + cmd.timeout)
                setTimeout(() => {
                    client.timeout.delete(`${cmd.name}${message.author.id}`)
                }, cmd.timeout)
            }
        }

    } catch (e) {
        console.log(e);
    }
}