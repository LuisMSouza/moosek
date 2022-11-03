//______________________________________________//
const { Colors, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

//______________________________________________//
module.exports = {
    name: "stop_radio",

    async execute(client, interaction) {
        const radioStruct = client.radio.get(interaction.guild.id);
        try {
            if (!client.radio) return;
            if (!interaction.member.voice.channel) {
                interaction.reply({
                    embeds: [
                        {
                            color: Colors.Red,
                            description:
                                "```\n❌ - Você precisa estar em um canal de voz para reagir!\n```",
                        },
                    ],
                    ephemeral: true,
                });
                //await reaction.users.remove(user);
                return;
            }
            if (
                radioStruct.voiceChannel.id !== interaction.member.voice.channel.id
            ) {
                interaction.reply({
                    embeds: [
                        {
                            color: Colors.Red,
                            description:
                                "```\n❌ - O bot está sendo utilizado em outro canal!\n```",
                        },
                    ],
                    ephemeral: true,
                });
                return;
            }
            const button2 = new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("smart")
                .setLabel("RADIO FINALIZADA")
                .setDisabled(true);
            await radioStruct.audioPlayer.stop();
            await radioStruct.connection.disconnect();
            await client.radio.delete(interaction.guild.id);
            const newRow = new ActionRowBuilder().addComponents(button2);
            interaction.update({ components: [newRow] });
        } catch (e) {
            console.log(e);
        }
        return;
    }
}
//______________________________________________//