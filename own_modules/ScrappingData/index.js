(function () {
    const request = require("request-promise-native");
    const cheerio = require("cheerio");
    const fs = require("fs");
    var files = require('../CustomFileModules/index.js');
    var scrappingFunction = {};

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
            returnData[individualName] = {
                allData: allData,
                freeDate: freeDate,
                busyDate: busyDate
            }
        }
        return new Promise((resolve, reject) => {
            resolve(returnData);
        })
    }
    scrappingFunction.getAllData = async (userName) => {
        var datas = [];
        await scrappingFunction.calculateAllData().then(data => {
            datas = data[userName].allData
        });
        return datas;
    }
    scrappingFunction.getFreeDate = async (userName) => {
        var datas = [];
        await scrappingFunction.calculateAllData().then(data => {
            datas = data[userName].freeDate
        });
        return datas;
    }
    scrappingFunction.getBusyDate = async (userName) => {
        var datas = [];
        await scrappingFunction.calculateAllData().then(data => {
            datas = data[userName].busyDate
        });
        return datas;
    }
    module.exports = scrappingFunction;
})();