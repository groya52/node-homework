// variables
const url = "http://www.cnews.ru/news/";

 // modules
const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const app = express();

// обработчик присланных данных/форм
const bodyParser = require('body-parser');
app.use(bodyParser.json()); //задаем формат json
app.use('/news', bodyParser.urlencoded({extended: true})); //urlencoded() - передача из формы, путь тот же, что и в action формы

// использование шаблонов
const consolidate = require('consolidate');
app.engine('hbs', consolidate.handlebars); //выбираем функцию шаблонизации
app.set('view engine', 'hbs'); //расширение шаблона
app.set('views', `${__dirname}/views`); //путь к шаблону

// использование куков
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/', (req, res, next) => {

  let qty = req.cookies.qty ? req.cookies.qty : '24';

  res.render('select', {
    title: 'Новости сайта cnews.ru',
    qty: qty,
  });
  
});

app.post('/news', (req, res) => {
  if(!req.body) return res.sendStatus(400);

  let qty = req.body.qty;

  if (res.cookie.qty) {
    req.cookies.qty = qty; //установить куки
  }
  else {
    res.cookie('qty', qty); //создать куки
  }
  
  getNews(res, qty);
});

const listener = app.listen(8888, () => {
  console.log('Express server listening on port %s.', listener.address().port);
});

//--------------------------------------- 
function getNews(res, qty) {
  request(url, (err, response, body) => {
    if (!err && res.statusCode == 200) {
      const $ = cheerio.load(body);

      let news = $('article').map((i, link) => {
        return {
          date: $(link).find('time').text().replace('Мск ', ''),
          title: $(link).find('h3').text(),
          text: $(link).children().hasClass('article_inner') ? $(link).find('a').eq(1).text() : $(link).contents().not($(link).children()).text(),
          url: $(link).find('a').attr("href"),
        }
      });

      res.render('news', {
        title: 'Новости сайта cnews.ru',
        news: news.toArray().slice(0, qty),
      });

    } else {
      throw err;
    }
  });
}