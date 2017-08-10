const cheerio = require('cheerio')
const axios = require('axios');
const fs = require('fs');

const BASE_WIKI_DOMAIN = 'https://overwatch.gamepedia.com';
const BASE_HEROES_PAGE = '/Category:Quotations';
const VOICE_LINES_IDS = [
  '#Voice_Lines',
  '#Abilities',
];

var heroesPages = [];
var voiceLines = {};
var finishedJobs = [];

function init() {
  retrieveHeroesPages();
}

function retrieveHeroesPages() {
axios.get(BASE_WIKI_DOMAIN + BASE_HEROES_PAGE)
  .then((result) => {
    const $ = cheerio.load(result.data, { decodeEntities: true });

    $('.mw-category-group ul li a').each((i, elem) => {
      heroesPages.push(elem.attribs.href);
    });

    retrieveVoiceLinesForEachHeroPage();
  });
}

function retrieveVoiceLinesForEachHeroPage() {
  heroesPages.map((url) => {
    axios.get(BASE_WIKI_DOMAIN + url)
      .then((result) => {
        const $ = cheerio.load(result.data, { decodeEntities: true });
        const heroName = $('h1.firstHeading').text().split('/')[0];

        VOICE_LINES_IDS.map((id) => {
          const voiceLinesTable = $(id).parent().next();

          voiceLinesTable.find('audio').each((i, elem) => {
            let audioQuote = $(elem.parent).prev().text();

            audioQuote = audioQuote.replace(/[^0-9a-zA-Z_\s]/g, '');
            audioQuote = audioQuote.replace(/\n/g, '');

            voiceLines[audioQuote] = $(elem).attr('src');
          });
        });

        finishedJobs.push(heroName);
        storeJsonFile();
      });
  });
}

function storeJsonFile() {
  if (finishedJobs.length == heroesPages.length) {
    const content = JSON.stringify(voiceLines);

    fs.writeFile("responses.json", content, 'utf8', function (err) {
      if (err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    });
}}

init()
