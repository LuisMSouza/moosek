/////////////////////// IMPORTS //////////////////////////
const SpotifyWebApi = require('spotify-web-api-node');
const SptfToken = require('./TokenAcess.json');
const fs = require('fs');
const sendError = require('../utils/error.js');
const play = require('../commands/playCommand.js');

const spotifyApi = new SpotifyWebApi({
    clientId: "9e88800cff1e43fc95e0c6bd421e0976",
    clientSecret: "a2d2b6951bec462ea6053754c51df3ad"
});
spotifyApi.setAccessToken(SptfToken.SpotifyAcessToken);
spotifyApi.setRefreshToken(process.env.SPOTIFY_KEY_REFRESH);

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    async refreshTokenAcess(client, message, search) {
        spotifyApi.refreshAccessToken().then(
            async function (data) {
                console.log('The access token has been refreshed!');
                spotifyApi.setAccessToken(data.body['access_token']);
                var json = JSON.stringify(data.body['access_token']);
                await fs.writeFile('./TokenAcess.json', json, function (err) {
                    if (err) return console.log(err);
                    console.log('erro garai');
                });
                return play.pre_main(client, message, search);
            },
            function (err) {
                console.log('Could not refresh access token', err);
                return sendError("Não foi possível reproduzir esta playlist :(", message.channel);
            }
        );
    }
}