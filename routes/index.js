var express = require('express');
var router = express.Router();
var data = require('../data/data.json');
var files = require('../own_modules/CustomFileModules');
var scrap = require('../own_modules/ScrappingData');
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/weekend');
});

router.get('/weekend', async function (req, res, next) {
  var kumarData = await  scrap.getFreeDate("Kumar");
  var maheshData = await  scrap.getFreeDate("Mahesh");
  var parveshData = await  scrap.getFreeDate("Parvesh");
  var suggestedDate=[];
  var length = Math.min(kumarData.length,maheshData.length,parveshData.length);
  for(var i=0;i<length;i++){
    if(maheshData.includes(kumarData[i])){
      if(parveshData.includes(kumarData[i])){
        suggestedDate.push(kumarData[i]);
      }
    }
  }
  var moviesDate =[];
  for(date of suggestedDate ){
      moviesDate.push(scrap.getMovieDetails(date));
  }
  res.render('index', {
    title: 'Development of Web Scraper',
    kumarData: kumarData,
    maheshData:maheshData,
    parveshData:parveshData,
    suggestedDate:suggestedDate,
    moviesDate:moviesDate,
    error: ""
  });
});

router.get('/calendar', function (req, res, next) {
  var name = req.query.name;
  if (name) {
    if (data['friendsName'].includes(name)) {
      res.redirect('/calendar/' + name);
    } else {
      res.redirect('/404');
    }
  }
  res.render('calendar', {
    title: 'Calendar Page',
    friendsName: data['friendsName']
  });
});

router.post('/calendar', function (req, res, next) {
  res.redirect('/calendar/' + req.body.name);
});

router.get('/calendar/:id', function (req, res, next) {
  const name = req.params.id;
  if (!(data['friendsName'].includes(name))) {
    res.redirect('/404');
  }
  var userDetails = files.getFileContent("data/" + name.toLowerCase() + ".json")
  userDetails = JSON.parse(userDetails);
  res.render('users', {
    title: name,
    details: userDetails,
  });
});

router.post('/calendar/:id', function (req, res, next) {
  console.log("This is called.")
  var date = req.body.datepicker;
  var isFree = req.body.isFree;
  var name = req.body.personname;
  var previousFileContent = files.getFileContent('data/'+name.toLowerCase()+'.json');
  var jsonOfpreviousFileContent = JSON.parse(previousFileContent);
  var saveObject = {
    "name": name,
    "date": date,
    "isFree": isFree
  }
  jsonOfpreviousFileContent.calendarDetails.push(saveObject);
  var saveFilePath= 'data/'+name.toLowerCase()+'.json'
  fs.writeFile(saveFilePath, JSON.stringify(jsonOfpreviousFileContent, null, 4), 'utf-8', function (err) {
    if (err) {
      // alert("Error" + err.message);
      console.log("Error" + err.message);
    } else {
      // alert("Updated data successfully");
      console.log("Updated data successfully");
    }
  });
  res.redirect('/calendar/' + name);
});

router.get('/cinema', function (req, res, next) {
  var movieDetails = files.getFileContent("data/cinema.json");
  movieDetails = JSON.parse(movieDetails);
  res.render('cinema', {
    title: 'Cinema Page',
    details: movieDetails
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