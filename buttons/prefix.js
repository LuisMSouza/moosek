//______________________________________________//
const sendError = require("../utils/error.js");
const { EmbedBuilder, ButtonBuilder, Colors } = require("discord.js");
const guildData = require("../models/guildData.js");
//______________________________________________//
module.exports = {
    name: "prefix_button",

    async execute(client, interaction) {
        const embdd = new EmbedBuilder()
            .setDescription("```fix\nDigite o novo prefixo\n```")
            .setColor(Colors.Yellow)
        const filter2 = (m) => m.author.id === interaction.author.id;
        interaction.update({ components: [], embeds: [embdd] });
        interaction.channel
            .awaitMessages({ filter2, max: 1, time: 300_000, errors: ["time"] })
            .then(async (collected) => {
                if (collected.first().content.length >= 5)
                    return sendError(
                        "Esse prefixo é muito longo!",
                        interaction.channel
                    );
                collected.first().content.toLowerCase();
                await guildData.findOneAndUpdate(
                    { guildID: interaction.guild.id },
                    {
                        $set: {
                            guildPrefix: collected.first().content.toLowerCase(),
                        },
                    },
                    { new: true }
                );
                const embed2 = new EmbedBuilder()
                    .setDescription(
                        "Prefixo alterado para: `" +
                        `${collected.first().content.toLowerCase()}` +
                        "`"
                    )
                    .setColor(Colors.Yellow);
                interaction.channel.send({ embeds: [embed2] });
            })
            .catch(
                (collected) =>
                    interaction.channel.send("Tempo de resposta esgotado") &&
                    console.log(collected)
            );
        return;
    }
}
//______________________________________________//