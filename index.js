const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
const util = require("util");
const pdf = require("html-pdf");
const open = require("open");
const generateHTML = require("./generateHTML.js");


const writeFileAsync = util.promisify(fs.writeFile);

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
        let convert = fs.readFileSync("./index.html", "utf-8");
        let options = { format: "Letter" };
        pdf.create(convert, options).toFile("index.pdf", (err, res) => {
            open("index.pdf");
            if (err)
                return reject(err)
            return resolve(res)
        })
    })
    .catch(function (err) {
        console.log(err);
    });
