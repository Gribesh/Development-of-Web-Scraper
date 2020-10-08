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


(function () {
    const request = require("request-promise-native");
    const cheerio = require("cheerio");
    const fs = require("fs");
    var files = require('../CustomFileModules/index.js');

    scrappingFunction = (function () {
        function scrappingFunction() {
            this.returnData = [];
        }
        scrappingFunction.calculateAllData = async () => {
            var returnData = [];
            var userNames = files.getFileContent("../../data/data.json"); //Update the path if changed the location
            userNames = JSON.parse(userNames).friendsName;
            // console.log(userNames);
            for (user in userNames) {
                const individualName = userNames[user];
                const userCalendar = "http://localhost:8080/calendar/" + individualName;
                let allData = [];
                let freeDate = [];
                let busyDate = [];
                const response = await request({
                    uri: userCalendar,
                });
                let $ = cheerio.load(response);
                let info = $('div[class="card-body"]>p');
                info.each(function () {
                    var incomingData = $(this).text();
                    var toSaveData = incomingData.split(':')[1].trim();
                    allData.push(toSaveData);
                });
                for (var i = 0; i < allData.length; i++) {
                    if (i % 3 == 2) {
                        if (allData[i] == 'true') {
                            freeDate.push(allData[i - 1]);
                        }
                        if (allData[i] == 'false') {
                            busyDate.push(allData[i - 1]);
                        }
                    }
                }
                // console.log(freeDate);
                // console.log(busyDate);
                returnData[individualName] = {
                    allData: allData,
                    freeDate: freeDate,
                    busyDate: busyDate
                }
            }
            this.returnData = returnData;
            return returnData;
        }

        scrappingFunction.getFreeDate = function () {
            return "Hello";
            // return this.freeDate;
        }
        return scrappingFunction;
    })();
    module.exports = scrappingFunction;
}).call(this);