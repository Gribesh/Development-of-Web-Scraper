(function () {
    var files = require('../CustomFileModules/index.js');
    var moviesFunction = {};

    moviesFunction.getMovieDetails = (date)=>{
        const fileData = files.getFileContent("data/cinema.json");
        var data=[];
        // console.log(fileData);
        var movieNames = JSON.parse(fileData).movies;
        for(movie in movieNames){
            if(date===movieNames[movie].date && movieNames[movie].isBooked==="false"){
                data.push(movieNames[movie]);
            }
        }
        return data;
    }
    module.exports = moviesFunction;
})();