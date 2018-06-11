#!/usr/bin/env node

// Import required packages
const fs = require('fs');
const assert = require('assert');
const jsonfile = require('jsonfile');
const program = require('commander');
const chalk = require('chalk');

program
    .arguments('<file>')
    .description('Transpiles a UniLang file into the language provided.')
    .action(function (file) {

        // Asserting to make sure that input is a valid fileapath
        assert(fs.existsSync(file) && fs.statSync(file).isFile(), chalk.red(`Error: ${file} is not a file.`));

        // Read input file
        var fileContents = String(fs.readFileSync(file));

        // Will be the output string
        var out = "";

        // Break by newline and semicolon
        fileContents = fileContents.split(/[\n;]/g).filter(x => x !== '');

        // Asserting to make sure a language can be found
        assert(fileContents[0].match(/^import[\s]*(\w*)$/), chalk.red(`Error while transpiling: Language must be on the first line as 'import language'`))

        // Extract language from first line
        var language = fileContents[0].match(/^import[\s]*(\w*)$/)[1];

        // Get proper conversion scheme from JSON file
        const scheme = jsonfile.readFileSync('conversion-scheme.json')[`${language}`];

        // Asserting to make sure the language exists in the conversion scheme
        assert(scheme, chalk.red(`Error while transpiling: ${language} is not a supported language yet`))

        // Remove import line because it has already been used
        fileContents.shift(0);

        // Iterate over all of the isolated lines of code
        for (var i = 0; i < fileContents.length; i++) {

            // Create variable to line of code for convenience
            const line = fileContents[i];

            // Disgusting line of code, searches line of code for UniLang variable syntax and stores the results
            const varData = line.match (/[\s]*var[\s]*([a-zA-Z]*)[\s]*:[\s]*([a-zA-Z]*)[\s]*=[\s]*(.*)$/);
            
            // Check if variable syntax was found
            if (varData) {

                // Add the transpiled variable line to the output
                out += parseVar (varData[1], varData[2], varData[3]);
                continue;
            }
        }

        console.log (fileContents);
        console.log (out);

        /**
         * @description Uses language scheme to generate a properly formatted line of code in the new language
         * @param {String} name Variable name
         * @param {String} type Variable type
         * @param {String} value Variable value
         * @returns {String} Converted line of code
         */
        function parseVar (name, type, value) {

            // Return line with inserted data
            return scheme.variable
                .replace ('${name}', name)
                .replace ('${type}', scheme.variables[type] ? scheme.variables[type] : type)
                .replace ('${value}', value);
        }
    })
    .parse(process.argv);