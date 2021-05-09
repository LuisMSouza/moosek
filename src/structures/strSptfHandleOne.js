/////////////////////// IMPORTS //////////////////////////
const SptfToken = require('../models/TokenAcess.json');
const fs = require('fs');

const spotifyApi = new SpotifyWebApi({
    clientId: "9e88800cff1e43fc95e0c6bd421e0976",
    clientSecret: "a2d2b6951bec462ea6053754c51df3ad"
});
spotifyApi.setAccessToken(SptfToken.SpotifyAcessToken);
spotifyApi.setRefreshToken(process.env.SPOTIFY_KEY_REFRESH);
/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    async handleSpotify(searchString, track, message) {
        if (searchString.includes("open.spotify.com/playlist")) {
            spotifyApi.getPlaylist(cath[2])
                .then(async function (data) {
                    const tracks = await data.body.tracks.items;
                    console.log(tracks[1].added_by.images[0]);
                    for (const track of tracks) {
                        await handleSpotify.handleVideo(track, message, voiceChannel, true);
                    }
                    return message.channel.send({
                        embed: {
                            color: "GREEN",
                            description: `**Playlist adicionada à fila**`,
                            fields: [
                                {
                                    name: "> __Pedido por:__",
                                    value: "```fix\n" + `${message.author.tag}` + "\n```",
                                    inline: true
                                }
                            ]
                        }
                    });
                }, async function (err) {
                    if (err.message.includes("Invalid playlist Id.")) {
                        sendError("Id da playlist inválido.", message.channel);
                        return;
                    }
                    if (err.message.includes("The access token expired.")) {
                        spotifyApi.refreshAccessToken().then(
                            async function (data3) {
                                console.log('The access token has been refreshed!');
                                await spotifyApi.setAccessToken(data3.body['access_token']);
                                var json = JSON.stringify(data3.body['access_token']);
                                await fs.writeFile('./TokenAcess.json', json, function (err) {
                                    if (err) return console.log(err);
                                });
                                spotifyApi.getPlaylist(cath[2])
                                    .then(async function (data2) {
                                        const tracks = await data2.body.tracks.items;
                                        for (const track of tracks) {
                                            await handleSpotify.handleVideo(track, message, voiceChannel, true);
                                        }
                                        return message.channel.send({
                                            embed: {
                                                color: "GREEN",
                                                description: `**Playlist adicionada à fila**`,
                                                fields: [
                                                    {
                                                        name: "> __Pedido por:__",
                                                        value: "```fix\n" + `${message.author.tag}` + "\n```",
                                                        inline: true
                                                    }
                                                ]
                                            }
                                        });
                                    });
                            },
                            function (err) {
                                console.log('Could not refresh access token', err);
                                return sendError("Não foi possível reproduzir esta playlist :(", message.channel);
                            }
                        );
                    }
                    console.log(err.message);
                    return;
                });
        }
    }
}