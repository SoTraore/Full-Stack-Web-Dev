const bodyParser = require('body-parser');
const express = require('express');
const https = require('https');
const path = require('path');
const axios = require('axios');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const filePath = path.resolve(__dirname, 'index.html');
  res.sendFile(filePath);
});

app.get("/satellite", (req, res) => {
    const id = "25544";
    const url = `https://api.wheretheiss.at/v1/satellites/${id}`;

    https.get(url, (response) => {
      let data = "";

      response.on('data', (chunk) => {
          data += chunk;
      });

      response.on('end', () => {
          const satelliteData = JSON.parse(data);
          const { latitude, longitude } = satelliteData;
          
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
          
          axios.get(url)
            .then(response => {
              const data = response.data;
              const location = data.display_name;

              res.write(`<h1>The satellite is currently at ${location}</h1>`);
              res.write(`<p>Its latitude is ${latitude} and longitude is ${longitude}.</p>`);
              res.end();
            })
            .catch(error => {
              console.error('Error:', error);
              res.write(`<p>Unable to retrieve location information.</p>`);
              res.end();
            });
          
      });

    });

});


app.post('/', (req, res) => {
  const location = req.body.location;
  const apiKey = '4b3a246dfdb0cf25637671ce08ed5221'; // Replace with your actual OpenWeatherMap API key
  const units = "metric";

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=${units}`;

  https.get(url, (response) => {
    let temp, feels_like, icon;

    response.on('data', (chunk) => {
      // Turning a json object to a js object

      const jsdata = JSON.parse(chunk); 
      temp = jsdata.list[0].main.temp;
      feels_like = jsdata.list[0].main.feels_like;
      icon = jsdata.list[5].weather[0].icon;

      // Turning a js object to a json object

      // const object = {
      //     doors : 2,
      //     drawers : 2,
      //     colour : "red"
      // } ;

      // console.log(JSON.stringify(object))
    });
    // console.log(response.list[0].main.temp);

    response.on('end', () => {
      res.write(`<p>A ${location} il fait ${temp}° et le feels_like est de ${feels_like}°</p>`);
      res.write(`<img src="http://openweathermap.org/img/w/${icon}.png" />`);
      res.send();
    });
  }).on('error', (error) => {
    console.error(error);
    res.status(500).send('An error occurred.');
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});