//простейший граббер новостного сайта
const http = require('http');
const request = require('request');
const cheerio = require('cheerio');
const url = "http://www.cnews.ru/news/";

function getNews(res) {

    request(url, (err, res1, html) => {
        let body = '';

        if (!err && res.statusCode == 200) {
            const $ = cheerio.load(html);

            $('article').each((i, link) => {
                let date = $(link).find('time').text();
                let title = $(link).find('h3').text();
                
                body += '\n' + (i + 1) + '. ' + date + ': ' + title;
            });
            rendering(res, body); 
        } else {
            throw err;
        }
    });

};

function rendering(res, body) {
    res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
    res.write(body);
    res.end();
}

http.createServer((req, res) => {
    let body = getNews(res);
}).listen(8888);

console.log('Server has started.');