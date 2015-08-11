/////////////////////////////////////////////////////////////////////////
//
//I/O Details:
//
//I - Array of arrays of sentences to process
//O - Array of gaps in the gap fill: [[[[Entity, StartPos, EndPos],[Entity, StartPos, EndPos]],sentence],[[[Entity, StartPos, EndPos],[Entity, StartPos, EndPos]],sentence]]
//
/////////////////////////////////////////////////////////////////////////

console.log("Question.JS:".bold + " Successfully Imported Required Packages".blue);

var questionModule = function () {
    var self = this;

    self.question = function question(inputArray, callback) {
        var output = [];
        var outputFinal = [];
        var sentence = inputArray.join(" ");
        var entityPositions = [];
        var res = Meteor.http.call("POST", "https://api.textrazor.com",{content: "apiKey=c0dbc052930dce78cc1dd1b37b3d3a4fb3f609c251c4f7e34a3b452a&text=" + sentence + "&extractors=" + "entities"});
        data = res.data.response;
        for (i = 0; i < data.entities.length; i++) {
            entityPositions.push([data.entities[i].matchedText, data.entities[i].startingPos, data.entities[i].endingPos]);
        }
        output = [entityPositions, sentence];
        
        output2 = JSON.stringify(output);
        callback(output2);
    }
};

//callback = [[[[Entity, StartPos, EndPos], [Entity, StartPos, EndPos]], sentence], [[[Entity, StartPos, EndPos], [Entity, StartPos, EndPos]], sentence]]