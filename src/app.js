/////////////////////// IMPORTS //////////////////////////
const Discord = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');

/////////////////////// ENGINE CONFIG //////////////////////////
dotenv.config();
const client = new Discord.Client();
const configVars = {
    token: process.env.TOKEN_KEY,
    prefix: process.env.PREFIX_KEY,
    genius_api: process.env.GENIUS_API_KEY,
}
client.commands = new Discord.Collection();
client.queue = new Map();
client.timeout = new Discord.Collection();

const commands = fs.readdirSync(`./src/commands`).filter(file => file.endsWith(".js"));
for (const file of commands) {
    const cmd = require(`./commands/${file}`);
    client.commands.set(cmd.name, cmd);
    console.log("Carregando comando: " + cmd.name)
}

fs.readdir(__dirname + "/events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        const event = require(__dirname + `/events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
        console.log("Carregando evento: " + eventName)
    });
});

/////////////////////// SOURCE CODE //////////////////////////
client.on('guildCreate', async (guild) => {
    try {
        var emoji = client.guilds.cache.get("731542666277290016").emojis.cache.find(emoji => emoji.name === "3224_info");

        const embed_1 = new MessageEmbed()
            .setTitle("Obrigado por me adicionar!")
            .addField(`${emoji} Como usar?`, `Para ober mais informações sobre os comandos do bot, basta digitar: **${process.env.PREFIX_KEY}ajuda**\nLogo em seguida, você receberá uma mensagem contendo os comandos disponíveis.`)
            .setTimestamp()

        if (guild.publicUpdatesChannel) {
            guild.publicUpdatesChannel.send(embed_1);
        }

        const embed_2 = new MessageEmbed()
            .setTitle("Novo servidor!")
            .setDescription("```css\nNOME: " + `${guild.name}` + "\nID: " + `(${guild.id})` + "\nCEO: " + `${guild.owner.user.tag} | (${guild.owner.user.id})` + "\nMEMBROS: " + `${guild.memberCount}` + "\nREGIÃO: " + `${guild.region}` + "\nV-LEVEL: " + `${guild.verificationLevel}` + "\n```")
            .setTimestamp()
            .setFooter(`Atualmente em ${client.guilds.cache.size} servidores`)
            .setThumbnail(guild.iconURL())

        client.channels.cache.get("807738719556993064").send(embed_2);
    } catch (e) {
        console.log(e);
    }
});

client.login(configVars.token);