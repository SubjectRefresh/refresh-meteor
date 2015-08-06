colors.setTheme({
  title: ['white', 'italic'],
  error: ['bgRed', 'white', 'bold'],
  info: ['bgYellow', 'white', 'italic'],
  success: ['bgGreen', 'white'],
});

var tokenizer = new natural.TreebankWordTokenizer();
var nounInflector = new natural.NounInflector();

var researchModule = function() {
    var self = this;
    
    self.researchTopic = function(topic, callback) {
        var allowed = true;
        var usefulSentences = [];
        var tcount = 0;
        for (var t = 0; t < topic.length; t++) {
            var topicWordsSplit = topic[t];
            console.log("Research.JS:".title + " Searching Bing".success);
            bing.web(topic[t], {top:3, skip:0}, function(err, res, body) {
                if (allowed == true) {
                    console.log("Research.JS:".title + " Received Bing Search Results".success);
                    var URL = []
                    if (body != undefined) {
                        console.log(res);
                        URL.push(body.d.results[0].Url);
                        URL.push(body.d.results[1].Url);
                        URL.push(body.d.results[2].Url);

                        var output = "";
                        var count = 0;
                        for (var i = 0; i < 3; i++) {
                            console.log("Research.JS:".title + (" Requesting Webpage, " + URL[i]).success);
                            request(URL[i], function(err, res, body) {
                                console.log("Research.JS:".title + " Received Webpage!".success);
                                output += body;
                                count += 1;
                                if (count == 3) {
                                    var $ = cheerio.load(output);
                                    var text = $("p").text();
                                    var sentenceArray = text.split(".");
                                    for (var i = 0; i < sentenceArray.length; i++) {
                                        var workingSentence = [];
                                        var tokenizedText = tokenizer.tokenize(sentenceArray[i]);
                                        var clause = 0;
                                        var usefulSentence = false;
                                        var irrelevent = false;
                                        for (var w = 0; w < tokenizedText.length; w++) {
                                            var pOSBuffer = "";
                                            if (tokenizedText[w] == "(") {clause += 1;}
                                            for (k in topicWordsSplit) {
                                                if (topicWordsSplit[k] != "of") {
                                                    if (natural.JaroWinklerDistance(tokenizedText[w], topicWordsSplit[k]) > 0.7) {
                                                        usefulSentence = true;
                                                    }   
                                                }
                                            }
                                            if (clause == 0) {
                                                if (w == tokenizedText.length - 1) {
                                                    workingSentence += tokenizedText[w];
                                                } else if ((w != "(") || (w != ")")) {
                                                    workingSentence += tokenizedText[w] + " ";
                                                } else {
                                                    workingSentence += tokenizedText[w];
                                                }
                                            }
                                            if (tokenizedText[w] == ")") {clause -= 1;}
                                            console.log(tokenizedText[w], "URL");
                                            if (natural.JaroWinklerDistance(tokenizedText[w], "URL") > 0.8) { 
                                                irrelevent = true;
                                            } if (natural.JaroWinklerDistance(tokenizedText[w], "exam") > 0.8) {
                                                irrelevent = true;
                                            } if (natural.JaroWinklerDistance(tokenizedText[w], "GCSE") > 0.8) {
                                                irrelevent = true;
                                            } if (natural.JaroWinklerDistance(tokenizedText[w], "Broadcasting") > 0.8) {
                                                irrelevent = true;
                                            } if (natural.JaroWinklerDistance(tokenizedText[w], "Accessibility") > 0.8) {
                                                irrelevent = true;
                                            } if (natural.JaroWinklerDistance(tokenizedText[w], "Cambridge") > 0.8) {
                                                irrelevent = true;
                                            }
                                        }
                                        workingSentence += ".";
                                        if ((usefulSentence == true) && (irrelevent == false)) {
                                            usefulSentences.push(workingSentence);
                                            console.log(workingSentence);
                                        }
                                        if (usefulSentences.length > 2) {
                                            break;
                                        }
                                    }
                                    tcount ++;

                                    // Only creates 5 points //
                                    if (tcount == 5) {
                                        console.log("FIND THIS: " + usefulSentences);
                                        callback(usefulSentences);
                                        allowed = false;
                                    }
                                }
                            });
                        }
                    }
                } else {
                    console.log("Blah");
                }
            });
        }
    };
}