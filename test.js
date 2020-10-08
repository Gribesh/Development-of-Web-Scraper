const request = require("request-promise-native");
const cheerio = require("cheerio");
const fs = require("fs");
var files = require('./own_modules/CustomFileModules/index.js');


(async()=>{
    var userNames= files.getFileContent("./data/data.json");
    userNames=JSON.parse(userNames).friendsName;
    // console.log(userNames);
    for(user in userNames){
    const userCalendar ="http://localhost:8080/calendar/"+userNames[user];
    let allData=[];
    let freeDate=[];
    let busyDate=[];
    const response =  await request({
        uri:userCalendar,
    });
    let $ = cheerio.load(response);
    // let info = $('div[class="card-body"]>p').text().trim();
    let info = $('div[class="card-body"]>p');
    info.each(function() {
        // if(count%3){

        // }
        // console.log($(this).text());
        var incomingData =$(this).text();
        var toSaveData = incomingData.split(':')[1].trim();
        allData.push(toSaveData);
        // console.log(toSaveData);
    });
    for(var i=0;i<allData.length;i++){
        if(i%3==2){
            if(allData[i]=='true'){
                freeDate.push(allData[i-1]);
            }
            if(allData[i]=='false'){
                busyDate.push(allData[i-1]);
            }
        }
    }
    
    // console.log(allData);
    console.log(freeDate);
    console.log(busyDate);
}
})()