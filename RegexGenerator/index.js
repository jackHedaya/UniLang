// Import required packages
const jsonfile = require ('jsonfile');

// Initialize sample line of code and language
const sample = 'const name : String = "Jack"';
const language = 'Java';

// Get all language conversion schemes from JSON file
schemes = jsonfile.readFileSync ('conversion-scheme.json');

// Get wanted language scheme and UniLang scheme
const langScheme = schemes[language];
const uniScheme = schemes["UniLang"];

// Delete schemes as it is no longer needed
delete schemes;

/**
 * @description A utility function to find and return the index of a value in an array
 * @param {any} value The value of the element to find the index of
 * @returns {int} The index of the value or -1 if not found
 */
Array.prototype.getIndexOfValue = function (value) {
    for (i = 0; i < this.length; i++) {
        if (this[i] === value)
            return i;
    }

    return -1;
}

// Generate the converted scheme
const convertedScheme = initializeRegex ();

/**
 * @description Convert the UniLang scheme into Regex
 * @returns {object} Converted scheme with extracted keys
 */
function initializeRegex () {

    // Create empty object as a return variable 
    var convertedScheme = {}

    // Iterate over al of the schemes in the original UniLang scheme
    for (var item in uniScheme) {

        // Add the scheme with beginning, ending, and starting whitespace regex
        var scheme = '^[\\s]*' + uniScheme[item] + '$';
        
        // The Regex to find any keys in the scheme
        var keyExtraction = new RegExp("[$]{(.*?)}", 'g');
        
        // Add the scheme to the convertedScheme object under the scheme type
        convertedScheme[item] = { 

            // Reformat the scheme to  Regex
            "expression": scheme
                .replace (/;/g, '')
                .replace (/[\s]/g, '[\\s]*')
                .replace (/[$]{(.*?)}/g, '(.*?)'),
            
            // Get all the necessary keys under the scheme
            keys : getMatches (scheme, keyExtraction),
        }
    }

    // Return the Regex-ified UniLang scheme
    return convertedScheme;
}

// Define output variable
var out;

// Iterate through all schemes looking for a match
for (var scheme in convertedScheme) {

    // Set the current scheme value for convenience
    const value = convertedScheme[scheme];

    // Get match
    const match = new RegExp (value.expression).exec (sample);

    // Continue through the loop if the match doesn't exist, remove the first element if the match does exist
    if (!match) continue; else match.shift ();

    // Get the necessary language scheme that will transpile to
    out = langScheme[scheme];

    // Go through the scheme keys
    for (var key of value.keys) {

        // Specific case. If the key is type, do key conversion
        if (key === "type") {
            const type = langScheme.types[match[value.keys.getIndexOfValue (key)]];

            out = out
                .replace (`\${${key}}`, type || (match[value.keys.getIndexOfValue (key)]) );

            continue;
        }
        
        // Replace all keys with the wanted values
        out = out
            .replace (`\${${key}}`, match[value.keys.getIndexOfValue (key)]);
    }

    // End loop, hopefully move on to the next line of code
    break;
}

/**
 * @description A function to go through a global Regex and return all matching groups (Not written by me)
 * @link Gotten from: https://stackoverflow.com/a/14210948
 * @param {*} string 
 * @param {*} regex 
 * @param {*} index 
 */
function getMatches (string, regex, index) {
    index || (index = 1); 
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
      matches.push(match[index]);
    }
    return matches;
}


console.log (out);