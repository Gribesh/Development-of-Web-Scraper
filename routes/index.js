var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/weekend');
});

router.get('/weekend', function(req, res, next) {
  res.render('index', { title: 'Development of Web Scraper' });
});

router.get('/calendar', function(req, res, next) {
  res.render('calendar', { title: 'Calendar Page'});
});

router.get('/cinema', function(req, res, next) {
  res.render('cinema', { title: 'Cinema Page'});
});

router.get('/restaurant', function(req, res, next) {
  res.render('restaurant', { title: 'Restaurant Page'});
});

module.exports = router;
