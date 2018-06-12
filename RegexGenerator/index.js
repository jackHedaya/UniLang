// Import required packages
const fs = require ('fs');
const jsonfile = require ('jsonfile');

const schemes = jsonfile.readFileSync ('/Users/jachedaya/Dropbox/Development/NodeJs/UniLang/conversion-scheme.json');

const sample = 'var myString : String = "Hello, World"';
const language = 'Java';

var convertedScheme = {}

Array.prototype.getIndexOfValue = function (value) {
    for (i = 0; i < this.length; i++) {
        if (this[i] === value)
            return i;
    }

    return -1;
}

for (var item in schemes["UniLang"]) {
    var scheme = '^[\\s]*' + schemes["UniLang"][item] + '$';

    var keyExtraction = new RegExp("[$]{(.*?)}", 'g');
    
    convertedScheme[item] = { 
        "expression": scheme
            .replace (/;/g, '')
            .replace (/[\s]/g, '[\\s]*')
            .replace (/[$]{(.*?)}/g, '(.*?)'),
        
        keys : getMatches (scheme, keyExtraction),
    }
}


console.log (convertedScheme);

for (var i in convertedScheme) {
    if (sample.match (convertedScheme[i].expression)) {
        console.log (i);
    }
}



function getMatches (string, regex, index) {
    index || (index = 1); 
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
      matches.push(match[index]);
    }
    return matches;
  }

