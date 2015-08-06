colors.setTheme({
  title: ['white', 'italic'],
  error: ['bgRed', 'white', 'bold'],
  info: ['bgYellow', 'white', 'italic'],
  success: ['bgGreen', 'white'],
});

var parseHTML = function(number) {
    var self = this;
    
    self.scrape = function(examBoard, examSubject, examSyllabus, callback) {
        fs.readFile("files/" + examSubject + ".html", 'utf8', function(err, data) {
            if (err) {console.log(err)};
            console.log("Success!");
            $ = cheerio.load(data);
            var bulletpointsplit = $("body").text();
            // console.log(bulletpointsplit);

            bulletpointsplit = bulletpointsplit.split("•");
            //console.log(bulletpointsplit);

            var temparray = bulletpointsplit;

            for (i = 0; i < bulletpointsplit.length; i++) {
                if (bulletpointsplit[i].indexOf("State the distinguishing properties of solids") > -1) {
                    console.log(bulletpointsplit[i]);
                    break;
                } else {
                    console.log("Shifted!");
                    temparray.shift()
                }
            }

            console.log(temparray);
            var bulletpointsplit2 = [];
            bulletpointsplit2 = temparray;

            for (i = temparray.length - 1; i > 0; i=i-1) {
                if (temparray[i].indexOf("different units and/or different linkages") > -1) {
                    console.log(temparray[i]);
                    break;
                } else {
                    console.log("Popped!");
                    temparray.pop()
                }
            }

            callback(temparray);
        });
    };
    
    self.convertPDF = function(examBoard, examSubject, examSyllabus, url, callback) {
        var getPDF = request(url).pipe(fs.createWriteStream("files/0620.pdf"));
        getPDF;
        console.log("Hi!");
        getPDF.on("finish", function() {
            var converter = new pdf("files/0620.pdf", "files/0620.html");
            converter.success(function() {
                console.log("Works! :D");
                callback();
            });
            converter.error(function(err) {
                console.log("ERROR! " + err);
            });
            converter.convert(); 
        });
    };
}