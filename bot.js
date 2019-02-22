'use strict'

const fs = require('fs');
const uuid = require('uuid4');

const TelegramBot = require('node-telegram-bot-api');
const token = 'Token Bitch';
const bot = new TelegramBot(token, {polling: true});

var voiceLines;

fs.readFile('./responses.json', function read(err, data) {
  if (err) {
    throw err;
  }
  voiceLines = JSON.parse(data);
});

bot.on('inline_query', (msg) => {
  if (!msg.query) {
    return;
  }

  const queryMessage = msg.query;
  const results = [];

  Object.keys(voiceLines).map((key) => {
    const expression = new RegExp(queryMessage, "gi");

    if (expression.test(key)) {
      const id = uuid();
      results.push({
        type: 'voice',
        id: id,
        voice_url: voiceLines[key],
        title: key,
      });
    }
  });

  console.log(results);

  bot.answerInlineQuery(msg.id, results.slice(0, 50), { cache_time: 1 });
});
