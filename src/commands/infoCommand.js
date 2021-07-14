const ms = require('ms');
const { MessageEmbed } = require('discord.js');
const { CLIENT_VERSION } = require('../utils/botUtils.js');
const { MessageButton, MessageActionRow } = require('discord-buttons');

module.exports = {
    name: "info",
    description: "Mostra informações do bot",
    usage: [process.env.PREFIX_KEY + 'info'],
    category: 'user',
    timeout: 7000,
    aliases: ['i', 'infos', 'status', 'stats'],

    async execute(client, message, args) {
        let ping = Math.round(message.client.ws.ping);
        let embed = new MessageEmbed()
            .setThumbnail(client.user.displayAvatarURL())
            .setColor("#0f42dc")
            .setTitle(`Informações`)
            .addField("Estou presente em:", client.guilds.cache.size + ` servidores`, true)
            .addField("Atividade atual:", client.user.presence.activities[0] ? client.user.presence.activities[0] : "Nenhuma atividade", true)
            .addField("Meu ID é:", client.user.id, true)
            .addField("Estou ativo há:", ms(client.uptime), true)
            .addField("Status atual:", client.user.presence.status, true)
            .addField("Ping atual:", `${ping} ms`, true)
            .addField("Versão atual:", `${CLIENT_VERSION}`, true)
            .addField("Alcancei um total de:", client.users.cache.size + ` pessoas`, true)

        const bt1 = new MessageButton()
            .setLabel("GERAR CONVITE")
            .setStyle("blurple")
            .setID("invite_button")

        const msgEmb = await message.channel.send({ component: bt1, embed: embed });
        const filter = (button) => button.clicker.user.id != client.user.id;
        const collector = msgEmb.createButtonCollector(filter, {});
        collector.on("collect", async (b) => {
            var emb = new MessageEmbed()
                .setTitle("CLIQUE AQUI :)")
                .setColor("#0f42dc")
                .setURL("https://discord.com/api/oauth2/authorize?client_id=778462497728364554&permissions=36826944&scope=bot")
                .setTimestamp()
                .setFooter("Moosek Client ™")
            await msgEmb.edit({ component: null, embed: emb });
            b.reply.defer();
        })
    }
}