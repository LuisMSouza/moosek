// -- BIBLIOTECAS E IMPORTS -- //
import sendError from '../utils/error.js';
import ms from 'ms';
import { findOne } from '../models/guildData.js';

// -- EXPORT EVENT -- //
export default async function (client, message) {
    try {
        var prefix = await findOne({ guildID: message.guild.id, })
        const args = message.content.split(/ +/g);
        const commandName = args.shift().slice(prefix.guildPrefix.length).toLowerCase();
        const cmd = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!message.content.toLowerCase().startsWith(prefix.guildPrefix) || !message.guild || message.author.bot) return;
        if (cmd) {
            if (cmd.timeout) {
                if (client.timeout.has(`${cmd.name}${message.author.id}`)) return sendError(`Aguarde ${ms(client.timeout.get(`${cmd.name}${message.author.id}`) - Date.now(), { long: true })} para usar esse comando novamente.`, message.channel)
                cmd.execute(client, message, args);
                client.timeout.set(`${cmd.name}${message.author.id}`, Date.now() + cmd.timeout)
                setTimeout(() => {
                    client.timeout.delete(`${cmd.name}${message.author.id}`)
                }, cmd.timeout)
            }
        }

    } catch (e) {
        console.log(e);
        return sendError("Alguma coisa desastrosa aconteceu :( Tente novamente...", message.channel);
    }
}