module.exports = async (client, message) => {
    const args = message.content.split(/ +/g);
    const commandName = args.shift().slice(process.env.PREFIX_KEY.length).toLowerCase();
    const cmd = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!message.content.toLowerCase().startsWith(process.env.PREFIX_KEY) || !message.guild || message.author.bot || !cmd) return;

    try {
        cmd.execute(client, message, args);

    } catch (e) {
        console.log(e);
    }
}