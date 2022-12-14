import weatherService from '../services/weatherService';
import { createClient } from 'redis';
require('dotenv').config()

const redisClient = createClient({ url: `${process.env.REDIS_URL}` });
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect().then(() => console.log('Redis Client Connected!'));

const handleGetWeatherInformation = async (req, res) => {
    try {
        const lat = req.params.lat
        const lon = req.params.lon
        const packageRes = await weatherService.getWeatherInfo(lat, lon, redisClient)
        res.json({ ...packageRes })
        packageRes.errCode === 0 ? res.status(201) : res.status(406)
        return res
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    handleGetWeatherInformation
}