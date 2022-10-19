import axios from 'axios';
import cityList from '../public/city.json';
require('dotenv').config()

const getWeatherInfo = (lat, lon, redisClient) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReturn = {}
            dataReturn.errCode = 0
            const id = findIdCity(lat, lon)
            const weatherCache = await redisClient.get(`${id}`)
            const URL = `http://api.openweathermap.org/data/2.5/forecast?id=${id}&appid=${process.env.OPEN_WEATHER_API_KEY}`
            if (weatherCache) {
                dataReturn.weather = weatherCache
            } else {
                const weather = await axios.get(URL)
                dataReturn.weather = JSON.stringify(weather.data)
                await redisClient.set(`${id}`, JSON.stringify(weather.data), { EX: getExpireTime() })
            }
            resolve(dataReturn)
        } catch (error) {
            reject(error)
        }
    })
}

const findIdCity = (lat, lon) => {
    let temp = []
    let minValue = 999
    for (let i = 0; i < cityList.length; i++) {
        let a = Math.abs(lat - cityList[i].coord.lat) + Math.abs(lon - cityList[i].coord.lon)
        temp.push(a)
    }
    for (let i = 0; i < temp.length; i++) {
        if (temp[i] < minValue) {
            minValue = temp[i]
        }
    }
    const index = temp.indexOf(minValue)
    return (cityList[index]).id
}

const getExpireTime = () => {
    const currentDate = new Date(new Date().getTime() + 7*60*60*1000)
    let nextDay = new Date()
    nextDay.setTime(currentDate.getTime() + 24*60*60*1000)
    nextDay.setHours(7, 0, 0, 0)
    return round((nextDay.getTime() - currentDate.getTime())/1000)
}

const round = (value, precision) => {
    const multiplier = Math.pow(10, precision || 0)
    return Math.round(value * multiplier) / multiplier
}

module.exports = {
    getWeatherInfo,
}