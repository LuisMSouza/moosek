/////////////////////// IMPORTS ///////////////////////////
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
import { CEO_ID, CLIENT_VERSION } from '../utils/botUtils.js';

/////////////////////// SOURCE CODE ///////////////////////////
export const name = "status";
export const description = "Mostra o status da aplicação";
export const usage = [process.env.PREFIX_KEY + 'status'];
export const category = 'ceo';
export const timeout = 5000;
export const aliases = [];
export async function execute(client, message, args) {
    /*
    if (message.author.id != CEO_ID) return;
    fetch(`https://discloud.app/status/bot/778462497728364554`, {
        headers: {
            "api-token": "DQl90nQTPADiqzdwlEuDMQMPXWTWnaGmCKvoIDVNuWy8PC66ARtT0PoyUkCwVs"
        }
    }).then(info => info.json()).then(json => {
        message.channel.send({
            embeds: [{
                color: "YELLOW",
                fields: [
                    {
                        name: "> **BOT ID**",
                        value: "```fix\n" + `${json.bot_id}` + "\n```",
                        inline: true
                    },
                    {
                        name: "> **DATE INFO**",
                        value: "```fix\n" + `${json.info}` + "\n```",
                        inline: true
                    },
                    {
                        name: "> **STATUS**",
                        value: "```fix\n" + `${json.container}` + "\n```",
                        inline: true
                    },
                    {
                        name: "> **CPU USAGE**",
                        value: "```fix\n" + `${json.cpu}` + "\n```",
                        inline: true
                    },
                    {
                        name: "> **MEMORY USAGE**",
                        value: "```fix\n" + `${json.memory}` + "\n```",
                        inline: true
                    },
                    {
                        name: "> **LAST RESTART**",
                        value: "```fix\n" + `${json.last_restart}` + "\n```",
                        inline: true
                    },
                    {
                        name: "> **SERVERS NUMB**",
                        value: "```fix\n" + `${client.guilds.cache.size} servidores` + "\n```",
                        inline: true
                    },
                    {
                        name: "> **PING**",
                        value: "```fix\n" + `${Math.round(message.client.ws.ping)} ms` + "\n```",
                        inline: true
                    },
                    {
                        name: "> **VERSION**",
                        value: "```fix\n" + `${CLIENT_VERSION}` + "\n```",
                        inline: true
                    },
                ]
            }]
        })
    })
    */
}