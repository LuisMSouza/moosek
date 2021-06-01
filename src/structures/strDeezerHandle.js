/////////////////////// IMPORTS //////////////////////////
const Deezer = require('deezer-public-api');
const dzr = new Deezer();

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    async deezerHandler(client, message, search, cth, voiceChannel) {
        const regEx
        if (cth.includes("/track/")) {
            dzr.track(``);
        } else if (cth.includes("/playlist/")) {
            dzr.playlist(``)
        } else if (cth.includes("/album/")) {
            dzr.album(``)
        }
    }
}