#!/usr/bin/env node

// Import required packages
const fs = require ('fs');
const assert = require ('assert');
const jsonfile = require ('jsonfile');
const program = require ('commander');
const chalk = require ('chalk');

program
    .arguments ('<file>')
    .description ('Transpiles a UniLang file into the language provided.')
    .action (function (file) {

        // Asserting to make sure that input is a valid fileapath
        assert (fs.existsSync (file) && fs.statSync (file).isFile (), chalk.red (`Error: ${file} is not a file.`));
            
        // Read input file
        var fileContents = String (fs.readFileSync (file));

        // Will be the output string
        var out = "";
        
        // Break by newline and semicolon
        fileContents = fileContents.split (/[\n;]/g).filter (x => x !== '');

        // Asserting to make sure a language can be found
        assert (fileContents[0].match (/^import[\s]*(\w*)$/), chalk.red (`Error while transpiling: Language must be on the first line as 'import language'`))
        
        // Extract language from first line
        var language = fileContents[0].match (/^import[\s]*(\w*)$/)[1];

        // Get proper conversion scheme from JSON file
        const conScheme = jsonfile.readFileSync ('conversion-scheme.json')[`${language}`];

        // Asserting to make sure the language exists in the conversion scheme
        assert (conScheme, chalk.red (`Error while transpiling: ${language} is not a supported language yet`))

        // Remove import line because it is already being used
        fileContents.pop(0);

        
        for (var i = 0; i < fileContents.length; i++) {
            
        }

        console.log(fileContents);
    })
    .parse (process.argv);