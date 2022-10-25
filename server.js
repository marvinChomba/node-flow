const express = require("express");
const cors = require("cors");
const db = require("./db");
const connection = require("./db");
const axios = require("axios");
const rp = require('request-promise')
const apiConfig = require("./api.config.js");



const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  let sql = `SELECT * FROM data`;

  connection.query(sql, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    function make_api_call(location) {
      return rp({
        url : `${apiConfig.url1}${location}${apiConfig.url2}`,
        method : 'GET',
        json : true
    })
    }

  async function processAddy(data) {
    toReturn = []
    for(let i = 0; i < data.length; i++) {
      gg = await make_api_call(results[i].location)
      toReturn.push({
        id: results[i].id,
        velocity: results[i].velocity,
        level:results[i].level,
        location: results[i].location,
        addy: gg.results[0].formatted_address
      })
    }

    return toReturn;
  }
  
  async function doTask(data) {
    let results = await processAddy(data);
    return results;
  }

  doTask(results).then((tt) => {
    res.json(tt);
  });


  });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});