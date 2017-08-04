'use strict'

const telegram = require('telegram-bot-api');
const axios = require('axios');

const api = new telegram({
  token: '441092785:AAGDVuvg9q6j4pOePB28AeA-KUQ1ixHdvHc',
  updates: {
    enabled: true,
  },
});

api.getMe()
  .then(function(data) {
    console.log(data);
  })
  .catch(function(err) {
    console.log(err);
  });


api.on('inline.query', function(message) {
  const queryMessage = message.query;


  axios.get('http://overwatch.gamepedia.com/api.php?action=query&titles=File%3AHanzo%20-%20Marked.ogg&prop=imageinfo&iiprop=url&format=json')
    .then((result) => {
      console.log(result.data);
    });
});

api.on('inline.result', function(message) {
  // Received chosen inline result
    console.log(message);
});

api.on('inline.callback.query', function(message) {
  // New incoming callback query
    console.log(message);
});
