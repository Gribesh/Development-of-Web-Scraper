var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/weekend');
});

router.get('/weekend', function(req, res, next) {
  res.render('index', { title: 'Development of Web Scraper' });
});

module.exports = router;
