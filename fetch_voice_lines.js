const cheerio = require('cheerio')
const axios = require('axios');

const BASE_WIKI_DOMAIN = 'https://overwatch.gamepedia.com';
const BASE_HEROES_PAGE = '/Category:Quotations';

var heroesPages = [];
var voiceLines = {};

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

        console.log(heroName);
        console.log($('audio')['0'].parent());
        // console.log($('audio'));

        $('audio').each((i, elem) => {
          // console.log($(elem.parent.prev).text());
          //console.log(elem.attribs.src);
          // voiceLines[this.parent.prev.text()] = $(this).attr('src');
        });

        console.log(voiceLines);
      });
  });
}

init()
