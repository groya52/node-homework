//простейший граббер сайта с прогнозом погоды

const request = require('request');
const cheerio = require('cheerio');
const url = "https://www.wunderground.com/weather/ru/saint-petersburg?cm_ven=localwx_today";

request(url, (err, res, html) => {
    if (!err && res.statusCode == 200) {
        const $ = cheerio.load(html);

        $('.forecast-wrap').each((i, link) => {

            let val = $(link).find('.day').text() +
                '\n' + $(link).find('.date').text() +
                '\n' + $(link).find('.primary-temp').text().replace(/\s\s/g, '') +
                '\n' + $(link).find('a.hook').text().replace(/\s\s/g, '') +
                '\n' + $(link).find('a.module-link').text().replace(/\s\s/g, '');

            console.log(val);

        });

    } else {
        throw err;
    }
});
