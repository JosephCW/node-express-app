// require dependencies
const config = require('config')     // for config variables
const express = require('express')   // Express web framework
const helmet = require('helmet')     // HTTP security
const fetch = require("node-fetch"); // fetching weather
// create an Express app
const app = express()

// use Helmet middleware to automatically set secure HTTP headers
app.use(helmet())

// Use hosting values if available, otherwise default 
const environment = process.env.NODE_ENV || 'development'
const hostname = process.env.HOSTNAME || config.get("hostname")
const port = process.env.PORT || config.get("port");

// Use Express app.get() methods to configure endpoints

// declare your callback function the old way
app.get('/', function (req, res) {
  
  res.send(`
    <h2> Here is a list of functions this website provides along with an example url<h2>
    <p>
      <table>
        <tr>
          <thead>
            <td>URL</td>
            <td>Usage</td>
          </thead>
        <tr>
        <tr>
          <td>/hello</td>
          <td>Print Hello World!</td>
        </tr>
        <tr>
          <td>/big</td>
          <td>Hello World Header</td>
        </tr>
        <tr>
          <td>/json</td>
          <td>Display an example json string</td>
        </tr>
        <tr>
          <td>/greeting/yourname</td>
          <td>Display a greeting for the passed in name</td>
        </tr>
        <tr>
          <td>/yo/yourname</td>
          <td>Says yo, yourname</td>
        </tr>
        <tr>
          <td>/fancy/?first=firstName&last=lastName</td>
          <td>Show hello and then first + last name</td>
        </tr>
        <tr>
          <td>/weather/id</td>
          <td>Pass in the id for a city and show the current weather! 5056172 is Maryville</td>
        </tr>
      </table
      <br/>
      Note: City id's can be found <a href="https://openweathermap.org/find?q=">here</a> <br/>
      Source Code <a href="https://github.com/JosephCW/node-express-app">here.</a>
    </p>
  `)
})

// or use the new arrow function syntax
// respond with text
app.get('/hello', (req, res) => {
  res.send('Hello World!')
})

// or respond with html
app.get('/big', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

// or respond with JSON
app.get('/json', (req, res) => {
  res.send('{"name" : "Nandini"}')
})

// :name indicates a parameter at this location in the URI
app.get('/greeting/:id', (req, res) => {
  res.send(`Hello! The id provided was ${req.params.id}.`)
})

// combine your skills and get creative
app.get('/yo/:buddy', (req, res) => {
  res.send(`<h1>Yo, ${req.params.buddy}!</h1>`)
})

// provide multiple query parameters with ? and &
app.get('/fancy', (req, res) => {
  const first = req.query.first
  const last = req.query.last
  res.send(`Hello ${first} ${last}!`)
})

async function getWeather(url) {
  const response = await fetch(url);
  const jsonResp = await response.json()
  console.log(JSON.stringify(jsonResp));
  return jsonResp;
}

app.get('/weather/:id', async (req, res) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?id=${req.params.id}&appid=78731028ab536f59c458d69b60e95a1c`
  const weather = await getWeather(url)
  res.send(`<h1>The weather for ${weather.name} is as follows</h1><br/>
    <p>
      ${weather.weather[0].description} <br/>
      ${weather.main.temp} deg k <br/>
      ${weather.main.humidity}% humidity </br>
    </p>`)
})

// Use middleware to handle all non-managed routes (e.g. /xyz)
// https://expressjs.com/en/api.html#req.originalUrl
app.use((req, res, next) => {
  res.status(404).send(`status 404 - ${req.originalUrl} was not found`);
})

// start listening and inform developers
app.listen(port, hostname, () => {
  console.log(`\n App listening at http://${hostname}:${port}/`)
  console.log(`\n Try going to different URIs:\n`)
  console.log(`   Try /hello`)
  console.log(`   Try /big`)
  console.log(`   Try /json`)
  console.log(`   Try /greeting/yourname`)
  console.log(`   Try /yo/Dr.Rogers`)
  console.log(`   Try /fancy/?first=Denise&last=Case`)
  console.log(`   Try going to /weather/5056172`)
  console.log('\n Hit CTRL-C CTRL-C to stop\n')
})

