var fs = require('fs');
var fileFunction = {};

fileFunction.getFileContent = (filename) => {
  try {
    var result = fs.readFileSync(filename, 'utf-8');
    if(filename.includes("json")){
      return JSON.parse(JSON.stringify(result,null,4));
    }
    return result;
  } catch (error) {
    return error.message;
  }
};
module.exports = fileFunction;