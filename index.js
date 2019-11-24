const inquirer = require("inquirer"); //allows for prompting user
const axios = require("axios"); //Promise based HTTP client for the browser and node.js
const fs = require("fs"); //Allows me to access local file system
const util = require("util"); //provides some utility functions
const pdf = require("html-pdf"); //HTML to PDF converter that uses phantomjs
const open = require("open"); //package to open pdf documents
const generateHTML = require("./generateHTML.js"); // imported js file that stores code for html generation


const writeFileAsync = util.promisify(fs.writeFile);


// prompts the user for github username and favorite color. User is restricted to 4 colors
function promptUser() {
    return inquirer.prompt([
        {
            type: "input",
            name: "username",
            message: "What is your GitHub username?"
        },
        {
            type: "list",
            name: "colors",
            choices: ["green", "blue", "pink", "red"]
        }
    ]);
}

//calls promptUser function and chains promises to perform specific tasks ending with a catch() which will throw an error if one exists
promptUser()
    .then(function (userAns) {
        data = userAns;
        console.log(userAns);
        let api = `https://api.github.com/users/${data.username}`;
        return axios.get(api)
    })
    .then(function (response) {
        console.log(response);
        const html = generateHTML(data, response);
        return writeFileAsync("index.html", html);
    })
    .then(function () {
        console.log("Successfully wrote to index.html");
        let convert = fs.readFileSync("./index.html", "utf8");
        let options = { format: "Letter" };
        pdf.create(convert, options).toFile("index.pdf", (err, res) => {
            open("index.pdf");
            if (err)
                return console.log(err)
            console.log(res)
        })
    })
    .catch(function (err) {
        console.log(err);
    });

/* Formatting in pdf was not working for me. HTML file is formatted the way I wanted it.
   Also, the blog icon is not reading right in pdf but in html it is the font I selected.
*/