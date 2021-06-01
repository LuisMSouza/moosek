/////////////////////// IMPORTS //////////////////////////
const Deezer = require('deezer-public-api');
const dzr = new Deezer();

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    async deezerHandler(client, message, search, cth, voiceChannel) {
        if (search.includes("/track/")) {
            dzr.track(`${cth}`).then(res => {
                console.log(res);
            })
        } else if (search.includes("/playlist/")) {
            dzr.playlist(`${cth}`)
        } else if (search.includes("/album/")) {
            dzr.album(`${cth}`)
        }
    }
}