/////////////////////// IMPORTS //////////////////////////
const handleTrack = require('./strSpotifyTrack.js');
const handleAlbum = require('./strSpotifyAlbum.js');
const handlePlaylist = require('./strSpotifyPlaylist.js')
const SpotifyWebApi = require('spotify-web-api-node');
const botData = require('../models/botData.js');
const bData = botData.findOne({
    Recc: process.env.BOT_DATA_ID
})

const spotifyApi = new SpotifyWebApi({
    clientId: bData.SpotifyClientId,
    clientSecret: bData.SpotifyClientSecret
});

spotifyApi.setAccessToken(bData.SpotifyTokenAcess);
spotifyApi.setRefreshToken(process.env.SPOTIFY_KEY_REFRESH);
/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    async handleSpotifyMusic(searchString, cath, message, voiceChannel) {
        if (searchString.includes("open.spotify.com/playlist")) {
            spotifyApi.getPlaylist(cath[2])
                .then(async function (data) {
                    const tracks = await data.body.tracks.items;
                    for (const track of tracks) {
                        await handlePlaylist.handleVideo(track, message, voiceChannel, true);
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
                                await botData.findOneAndUpdate({ _id: process.env.BOT_DATA_ID }, { $set: { SpotifyTokenAcess: data3.body['access_token'] } });
                                spotifyApi.getPlaylist(cath[2])
                                    .then(async function (data2) {
                                        const tracks = await data2.body.tracks.items;
                                        for (const track of tracks) {
                                            await handlePlaylist.handleVideo(track, message, voiceChannel, true);
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

        } else if (searchString.includes("open.spotify.com/track")) {
            spotifyApi.getTrack(`${cath[2]}`)
                .then(async function (data4) {
                    const track = data4.body
                    await handleTrack.handleVideo(track, message, voiceChannel);
                    return;
                }, function (err) {
                    if (err.message.includes("The access token expired.")) {
                        spotifyApi.refreshAccessToken().then(
                            async function (data6) {
                                console.log('The access token has been refreshed!');
                                await spotifyApi.setAccessToken(data6.body['access_token']);
                                await botData.findOneAndUpdate({ _id: process.env.BOT_DATA_ID }, { $set: { SpotifyTokenAcess: data3.body['access_token'] } });
                                spotifyApi.getTrack(cath[2])
                                    .then(async function (data8) {
                                        const track = data8.body
                                        await handleTrack.handleVideo(track, message, voiceChannel);
                                    });
                            },
                            function (err) {
                                console.log('Could not refresh access token', err);
                                return sendError("Não foi possível reproduzir esta playlist :(", message.channel);
                            }
                        );
                    }
                });
        } else if (searchString.includes("open.spotify.com/album")) {
            spotifyApi.getAlbumTracks(`${cath[2]}`)
                .then(async function (data5) {
                    const tracks2 = await data5.body.items
                    for (const track of tracks2) {
                        await handleAlbum.handleVideo(track, message, voiceChannel, true);
                    }
                    return message.channel.send({
                        embed: {
                            color: "GREEN",
                            description: `**Album adicionado à fila**`,
                            fields: [
                                {
                                    name: "> __Pedido por:__",
                                    value: "```fix\n" + `${message.author.tag}` + "\n```",
                                    inline: true
                                }
                            ]
                        }
                    });
                }, function (err) {
                    if (err.message.includes("The access token expired.")) {
                        spotifyApi.refreshAccessToken().then(
                            async function (data4) {
                                console.log('The access token has been refreshed!');
                                await spotifyApi.setAccessToken(data4.body['access_token']);
                                await botData.findOneAndUpdate({ _id: process.env.BOT_DATA_ID }, { $set: { SpotifyTokenAcess: data3.body['access_token'] } });
                                spotifyApi.getAlbumTracks(cath[2])
                                    .then(async function (data7) {
                                        const tracks = await data7.body.items;
                                        for (const track of tracks) {
                                            await handleAlbum.handleVideo(track, message, voiceChannel, true);
                                        }
                                        return message.channel.send({
                                            embed: {
                                                color: "GREEN",
                                                description: `**Album adicionado à fila**`,
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
                })
        }
    }
}