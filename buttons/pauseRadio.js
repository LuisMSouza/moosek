//______________________________________________//
const { Colors, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

//______________________________________________//
module.exports = {
    name: "pause_radio",

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
            const buttonResume = new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setCustomId("resume_radio")
                .setLabel("RESUMIR RADIO");
            const button1 = new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("stop_radio")
                .setLabel("PARAR RADIO");
            await radioStruct.audioPlayer.pause();
            const row2 = new ActionRowBuilder().addComponents(
                button1,
                buttonResume
            );

            interaction.update({ components: [row2] });
            return;
        } catch (e) {
            console.log(e);
        }
        return;
    }
}
//______________________________________________//