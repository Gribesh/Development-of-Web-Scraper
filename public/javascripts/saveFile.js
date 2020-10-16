function alertFunction() {
  var files = require('../../own_modules/CustomFileModules');
  var date = document.getElementById("datepicker").value;
  var isFree = document.getElementById("isFree").value;
  var name = document.getElementById("personname").value;
  var previousFileContent = files.getFileContent('../data/kumar.json');
  var jsonOfpreviousFileContent = JSON.parse(previousFileContent);
  var saveObject = {
    "name": name,
    "date": date,
    "isFree": isFree
  }
  jsonOfpreviousFileContent.calendarDetails.push(saveObject);
  fs.writeFile('../data/kumar.json', JSON.stringify(jsonOfpreviousFileContent, null, 4), 'utf-8', function (err) {
    if (err) {
      alert("Error" + err.message);
    } else {
      alert("Updated data successfully");
    }
  })
}