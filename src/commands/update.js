////////////////// IMPORTS //////////////////////
const cons = require('child_process');
const path = require('path');
const { CEO_ID } = require('../utils/botUtils.js');

////////////////// SOURCE CODE //////////////////
module.exports = {
  name: "update",
  description: "Update dos arquivos git",
  usage: [process.env.PREFIX_KEY + 'update'],
  category: 'ceo',
  timeout: 5000,
  aliases: ['up'],

  async execute(client, message, args) {
    if (message.member.id != CEO_ID) return;
    const { stdout, stderr, err } = await cons.exec(`git pull ${require('../package.json').repository.url.split('+')[1]}`, { cwd: path.join(__dirname, '../') }).catch(err => ({ err }));
    if (err) console.log(err);
    const out = [];
    if (stdout) out.push(stdout);
    if (stderr) out.push(stderr);
    await message.channel.send(out.join('---\n'), { code: true });
    if (!stdout.toString().includes('Already up-to-date.') && (message.flags[0] === 'restart' || message.flags[0] === 'r')) {
      client.commands.get('reboot').execute(client, message, args);
    }
  }
}