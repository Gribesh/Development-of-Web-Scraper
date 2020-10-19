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
  var kumarData = await scrap.getFreeDate("Kumar");
  var maheshData = await scrap.getFreeDate("Mahesh");
  var parveshData = await scrap.getFreeDate("Parvesh");
  var suggestedDate = [];
  var error;
  var length = Math.max(kumarData.length, maheshData.length, parveshData.length);
  for (var i = 0; i < length; i++) {
    if (maheshData.includes(kumarData[i])) {
      if (parveshData.includes(kumarData[i])) {
        suggestedDate.push(kumarData[i]);
      }
    }
  }
  var moviesDate = [];
  for (date of suggestedDate) {
    moviesDate.push(scrap.getMovieDetails(date));
  }
  if(kumarData.length==0 || maheshData.length==0 || parveshData.length==0 || suggestedDate.length==0 || moviesDate.length==0){
    error="Can't find proper date. Please add few more dates"
  }
  res.render('index', {
    title: 'Development of Web Scraper',
    kumarData: kumarData,
    maheshData: maheshData,
    parveshData: parveshData,
    suggestedDate: suggestedDate,
    moviesDate: moviesDate,
    error: error
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
  var date = req.body.datepicker;
  var isFree = req.body.isFree;
  var name = req.body.personname;
  var previousFileContent = files.getFileContent('data/' + name.toLowerCase() + '.json');
  var jsonOfpreviousFileContent = JSON.parse(previousFileContent);
  var saveObject = {
    "name": name,
    "date": date,
    "isFree": isFree
  }
  jsonOfpreviousFileContent.calendarDetails.push(saveObject);
  var saveFilePath = 'data/' + name.toLowerCase() + '.json'
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
  var date=req.query.date;
  var time =  req.query.time;
  var payload={
    date:date,
    time:time
  }
  if (req.session.email) {
    res.redirect('/restaurant/auth');
  } else {
    var error="";
    if(req.session.error){
      error=req.session.error
    }
    res.render('restaurant', {
      title: 'Restaurant Page',
      error:error,
    });
  }
});

router.post('/restaurant', function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var payload;
  if(req.body.time && req.body.date){
    payload={
      time:req.body.time,
      date:req.body.date
    };
  }
  if (email === "1nt17cs063.gribesh@nmit.ac.in" && password === "cse2020") {
    req.session.email = email;
    req.session.payload=payload;
    res.redirect('/restaurant/auth');
  } else {
    res.render('restaurant', {
      title: 'Restaurant Page',
      error:"Please enter email and password",
      payload:payload,
    });
  }
});


router.get('/restaurant/auth', function (req, res, next) {

  if (req.session.email) {
    // res.write(`<h1>Hello ${req.session.email} </h1><br>`);
    // res.end('<a href=' + '/restaurant/logout' + '>Logout</a>');
    var fileData = files.getFileContent('data/restaurantBooking.json');
    var jsonFileData = JSON.parse(fileData);
    const date= req.session.payload.date;
    const time= req.session.payload.time;
    var sendInfo={};
    if(jsonFileData[date] && jsonFileData[date][time]){
      sendInfo=jsonFileData[date][time];
    } else{
      jsonFileData[date]={};
      jsonFileData[date][time]={};
      const obj={
        isBooked: "false",
        bookId: Math.floor(Math.random() * Math.floor(100))
      }
      jsonFileData[date][time]=obj
      sendInfo=jsonFileData[date][time];
      fs.writeFile('data/restaurantBooking.json', JSON.stringify(jsonFileData, null, 4), 'utf-8', function (err) {
        if (err) {
          // alert("Error" + err.message);
          console.log("Error" + err.message);
        } else {
          // alert("Updated data successfully");
          console.log("Updated data successfully");
        }
      });
    }
    res.render("restaurantHome",{
      title:"Home Page",
      payload:req.session.payload,
      email:req.session.email,
      receiveInfo:sendInfo
    })
  } else {
    // res.write('<h1>Please login first.</h1>');
    // res.end('<a href=' + '/' + '>Login</a>');
    req.session.error="Please login first."
    res.redirect('/restaurant');
  }
});
router.post('/restaurant/auth', function (req, res, next) {
  const time = req.session.payload.time;
  const email = req.session.email;
  const date= req.session.payload.date;
  var fileData = files.getFileContent('data/restaurantBooking.json');
  var jsonFileData = JSON.parse(fileData);
  var saveObject={
    isBooked: "true",
    bookId: jsonFileData[date][time].bookId,
    email:email
  }
  jsonFileData[date][time] = saveObject;
  fs.writeFile('data/restaurantBooking.json', JSON.stringify(jsonFileData, null, 4), 'utf-8', function (err) {
    if (err) {
      // alert("Error" + err.message);
      console.log("Error" + err.message);
    } else {
      // alert("Updated data successfully");
      console.log("Updated data successfully");
    }
  });

  res.render("restaurantHome",{
    title:"Home Page",
    payload:req.session.payload,
    email:req.session.email,
    receiveInfo:saveObject
  })
});
router.get('/restaurant/logout',(req,res) => {
  req.session.destroy((err) => {
      if(err) {
          return console.log(err);
      }
      res.redirect('/');
  });
});

router.get('/marco/:id', function (req, res, next) {
  var id = req.params.id;
  res.render('polo', {
    title: id
  });
});

module.exports = router;