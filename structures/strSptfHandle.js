/////////////////////// IMPORTS //////////////////////////
const handleTrack = require("./strSpotifyTrack.js");
const handleAlbum = require("./strSpotifyAlbum.js");
const handlePlaylist = require("./strSpotifyPlaylist.js");
const SpotifyWebApi = require("spotify-web-api-node");
const sendError = require("../utils/error.js");
const acess = require("../utils/acess.json");
var fs = require("fs");
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPTF_CLIENT,
  clientSecret: process.env.SPTF_SECRET,
});
const { Colors } = require("discord.js");

spotifyApi.setAccessToken(acess.acess);
spotifyApi.setRefreshToken(process.env.SPOTIFY_KEY_REFRESH);
/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
  async handleSpotifyMusic(client, searchString, cath, message, voiceChannel) {
    const emoji = client.guilds.cache
      .get("731542666277290016")
      .emojis.cache.find((emj) => emj.name === "7041_loading");
    if (searchString.includes("open.spotify.com/playlist")) {
      spotifyApi.getPlaylist(cath[2]).then(
        async function (data) {
          const tracks = await data.body.tracks.items;
          const msg = await message.channel.send(
            `${emoji} Adicionando músicas...`
          );
          for (const track of tracks) {
            await handlePlaylist.handleVideo(
              client,
              track,
              message,
              voiceChannel,
              true
            );
          }
          await msg.delete(msg);
          return message.channel.send({
            embeds: [
              {
                color: Colors.Yellow,
                description: `**Playlist adicionada à fila**`,
                fields: [
                  {
                    name: "> __Pedido por:__",
                    value: "```fix\n" + `${message.member.user.tag}` + "\n```",
                    inline: true,
                  },
                  {
                    name: "> __Total de músicas:__",
                    value: "```fix\n" + `${tracks.length}` + "\n```",
                    inline: true,
                  },
                ],
              },
            ],
          });
        },
        async function (err) {
          if (err.message.includes("Invalid playlist Id.")) {
            sendError("Id da playlist inválido.", message.channel);
            return;
          }
          if (err.message.includes("The access token expired.")) {
            spotifyApi.refreshAccessToken().then(
              async function (data3) {
                console.log("The access token has been refreshed!");
                await spotifyApi.setAccessToken(data3.body["access_token"]);
                fs.writeFile(
                  "./utils/acess.json",
                  JSON.stringify(data3.body["access_token"]),
                  (err) => {
                    if (err) {
                      console.error(err);
                      return;
                    }
                  }
                );
                spotifyApi.getPlaylist(cath[2]).then(async function (data2) {
                  const tracks = await data2.body.tracks.items;
                  const msg = await message.channel.send(
                    `${emoji} Adicionando músicas...`
                  );
                  for (const track of tracks) {
                    await handlePlaylist.handleVideo(
                      client,
                      track,
                      message,
                      voiceChannel,
                      true
                    );
                  }
                  msg.delete(msg);
                  return message.channel.send({
                    embeds: [
                      {
                        color: Colors.Yellow,
                        description: `**Playlist adicionada à fila**`,
                        fields: [
                          {
                            name: "> __Pedido por:__",
                            value:
                              "```fix\n" +
                              `${message.member.user.tag}` +
                              "\n```",
                            inline: true,
                          },
                          {
                            name: "> __Total de músicas:__",
                            value: "```fix\n" + `${tracks.length}` + "\n```",
                            inline: true,
                          },
                        ],
                      },
                    ],
                  });
                });
              },
              function (err) {
                console.log("Could not refresh access token", err);
                return sendError(
                  "Não foi possível reproduzir esta playlist :(",
                  message.channel
                );
              }
            );
          }
          console.log(err.message);
          return;
        }
      );
    } else if (searchString.includes("open.spotify.com/track")) {
      spotifyApi.getTrack(`${cath[2]}`).then(
        async function (data4) {
          const track = data4.body;
          await handleTrack.handleVideo(client, track, message, voiceChannel);
          return;
        },
        function (err) {
          if (err.message.includes("The access token expired.")) {
            spotifyApi.refreshAccessToken().then(
              async function (data6) {
                console.log("The access token has been refreshed!");
                await spotifyApi.setAccessToken(data6.body["access_token"]);
                fs.writeFile(
                  "./utils/acess.json",
                  JSON.stringify(data6.body["access_token"]),
                  (err) => {
                    if (err) {
                      console.error(err);
                      return;
                    }
                  }
                );
                spotifyApi.getTrack(cath[2]).then(async function (data8) {
                  const track = data8.body;
                  await handleTrack.handleVideo(
                    client,
                    track,
                    message,
                    voiceChannel
                  );
                });
              },
              function (err) {
                console.log("Could not refresh access token", err);
                return sendError(
                  "Não foi possível reproduzir esta playlist :(",
                  message.channel
                );
              }
            );
          }
        }
      );
    } else if (searchString.includes("open.spotify.com/album")) {
      spotifyApi.getAlbumTracks(`${cath[2]}`).then(
        async function (data5) {
          const tracks2 = await data5.body.items;
          const msg = await message.channel.send(
            `${emoji} Adicionando músicas...`
          );
          for (const track of tracks2) {
            await handleAlbum.handleVideo(
              client,
              track,
              message,
              voiceChannel,
              true
            );
          }
          await msg.delete(msg);
          return message.channel.send({
            embeds: [
              {
                color: Colors.Yellow,
                description: `**Album adicionado à fila**`,
                fields: [
                  {
                    name: "> __Pedido por:__",
                    value: "```fix\n" + `${message.member.user.tag}` + "\n```",
                    inline: true,
                  },
                  {
                    name: "> __Total de músicas:__",
                    value: "```fix\n" + `${tracks2.length}` + "\n```",
                    inline: true,
                  },
                ],
              },
            ],
          });
        },
        function (err) {
          if (err.message.includes("The access token expired.")) {
            spotifyApi.refreshAccessToken().then(
              async function (data4) {
                console.log("The access token has been refreshed!");
                await spotifyApi.setAccessToken(data4.body["access_token"]);
                fs.writeFile(
                  "./utils/acess.json",
                  JSON.stringify(data4.body["access_token"]),
                  (err) => {
                    if (err) {
                      console.error(err);
                      return;
                    }
                  }
                );
                spotifyApi.getAlbumTracks(cath[2]).then(async function (data7) {
                  const tracks = await data7.body.items;
                  const msg = await message.channel.send(
                    `${emoji} Adicionando músicas...`
                  );
                  for (const track of tracks) {
                    await handleAlbum.handleVideo(
                      client,
                      track,
                      message,
                      voiceChannel,
                      true
                    );
                  }
                  await msg.delete(msg);
                  return message.reply({
                    embeds: [
                      {
                        color: Colors.Yellow,
                        description: `**Album adicionado à fila**`,
                        fields: [
                          {
                            name: "> __Pedido por:__",
                            value:
                              "```fix\n" +
                              `${message.member.user.tag}` +
                              "\n```",
                            inline: true,
                          },
                          {
                            name: "> __Total de músicas:__",
                            value: "```fix\n" + `${tracks.length}` + "\n```",
                            inline: true,
                          },
                        ],
                      },
                    ],
                  });
                });
              },
              function (err) {
                console.log("Could not refresh access token", err);
                return sendError(
                  "Não foi possível reproduzir esta playlist :(",
                  message.channel
                );
              }
            );
          }
        }
      );
    }
  },
};
