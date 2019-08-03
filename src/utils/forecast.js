const request = require('request')
const chalk = require('chalk')

const forecast = (lat, lon, callback) => {
    const url = 'https://api.darksky.net/forecast/<YOUR API KEY>/' + lat + ',' + lon + '?units=si&lang=en'

    request({ url, json: true}, (error, { body }) => {
    if (error) {
        callback(chalk.red('Unable to connect to weather service!'), undefined)
    } else if (body.error) {
        callback(chalk.red(body.error), undefined)
    } else {
        callback(undefined, body.daily.data[0].summary + ' It is currently ' + body.currently.temperature + ' degrees out. There is a ' + body.currently.precipProbability * 100 + '% chance of rain.' + ' The humidity is ' + body.currently.humidity * 100 + '%.')
    }
})
}

module.exports = forecast