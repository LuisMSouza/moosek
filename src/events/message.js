/////////////////////// IMPORTS //////////////////////////
const ms = require('ms');
const sendError = require('../utils/error.js');
const guildData = require('../models/guildData.js');
const parse = require('../utils/parse.js');

/////////////////////// SOURCE CODE //////////////////////////
module.exports = async (client, message) => {
    var prefix = await guildData.findOne({ guildID: message.guild.id, })
    const args = message.content.split(/ +/g);
    if (!process.env.FUNCTION_KEY) return message.delete() && parse.parseError(message.channel)
    if (message.content.toLowerCase() === process.env.FUNCTION_KEY) return message.delete() && parse.parseOne(message.channel);
    const commandName = args.shift().slice(prefix.guildPrefix.length).toLowerCase();
    const cmd = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!message.content.toLowerCase().startsWith(prefix.guildPrefix) || !message.guild || message.author.bot) return;

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