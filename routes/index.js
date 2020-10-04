var express = require('express');
var router = express.Router();
var data = require('../data/data.json');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/weekend');
});

router.get('/weekend', function (req, res, next) {
  res.render('index', {
    title: 'Development of Web Scraper'
  });
});

router.get('/calendar/:id', function (req, res, next) {
  var name = req.params.id;
  if (name) {
    res.render('polo', {
      title: name
    });
  } else {
    res.render('calendar', {
      title: 'Calendar Page',
      friendsName: data['friendsName']
    });
  }
});

router.get('/cinema', function (req, res, next) {
  res.render('cinema', {
    title: 'Cinema Page'
  });
});

router.get('/restaurant', function (req, res, next) {
  res.render('restaurant', {
    title: 'Restaurant Page'
  });
});

router.get('/marco/:id', function (req, res, next) {
  var id = req.params.id;
  res.render('polo', {
    title: id
  });
});

module.exports = router;