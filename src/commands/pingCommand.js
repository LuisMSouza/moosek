/////////////////////// IMPORTS ///////////////////////////

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "ping",
    description: "Mostra o ping da API",
    usage: [process.env.PREFIX_KEY + 'ping'],
    category: 'user',
    timeout: 5000,
    aliases: [],

    async execute(client, message, args) {
        let ping = Math.round(message.client.ws.ping);
        message.channel.send(({
            embeds: [
                {
                    color: "#2592b0",
                    description: `**${ping} ms**`
                }
            ]
        }))
    }
}