const request = require('request');
const fs = require('fs');
const readline = require('readline');

const URL = process.argv[2];
const filePath = process.argv[3];

let dirPath = filePath.split("/");
dirPath.pop();
dirPath = dirPath.join("/");
dirPath += "/";
console.log(dirPath);

request(URL, (error, response, body) => {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  if (response && response.statusCode === 200) {
    fs.access(dirPath, (err) => {
      if (err) {
        console.log("Not a valid directory!");
      } else {
        fs.access(filePath, fs.constants.F_OK, (err1) => {
          if (err1) {
            console.log("File does not exist");
            fs.writeFile(filePath, body, (err) => {
              if (err) {
                console.log("Error: write failed");
              }
            });
          } else {
            const rl = readline.createInterface({
              input: process.stdin,
              output: process.stdout
            });
            rl.question("File already exists. Overwrite (y)? ", (answer) => {
              if (answer === "y") {
                fs.writeFile(filePath, body, (err) => {
                  if (err) {
                    console.log("Error: write failed");
                  }
                });
                rl.close();
              } else {
                rl.close();
              }
            });
          }
        });
      }
    });
  } else {
    console.log("Error: request failed!");
  }
});
