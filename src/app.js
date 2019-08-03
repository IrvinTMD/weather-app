const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const chalk = require('chalk')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirPath))

app.get('', (req, res) => {
    res.render('index', {
        title: "Weather",
        name: "TMD"
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: "About",
        name: "TMD"
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: "Help/FAQ",
        message: "Head over to the home page to get a weather forecast for a location of your choice!"
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "Address required"
        })
    }

    geocode(req.query.address, (error, {lat, lon, loc} = {}) => {
        if (error) {
            return res.send({
                error: error
            })
        }
        
        forecast(lat, lon, (error, forecastData) => {
            if (error) {
                console.log(chalk.red(error))
            }

            res.send({
                latitude: lat,
                longitude: lon,
                location: loc,
                address: req.query.address,
                forecast: forecastData
            })
          })
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'TMD',
        errorMessage: 'Help page not found!'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: "404",
        name: "TMD",
        errorMessage: 'Page not found.'
    })
})

app.listen(port, () => {
    console.log('Server is up on port 3000')
})