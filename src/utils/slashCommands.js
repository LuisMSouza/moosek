const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = async (commandName, description, input, resInput) => {
    const data = new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(description)
    if (input != null) {
        data.addStringOption(option =>
            option.setName(input)
                .setDescription(resInput)
                .setRequired(true));
    }
}