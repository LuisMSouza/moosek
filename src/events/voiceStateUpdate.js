module.exports = (client, oldState, newState, message, member) => {
    if (newState.member.id === client.user.id && !newState.connection) {
        client.queue.delete(newState.guild.id)
    }
}