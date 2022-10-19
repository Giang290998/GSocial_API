import weatherService from '../services/weatherService';
import { createClient } from 'redis';

const redisClient = createClient();
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect().then(() => console.log('Redis Client Connected!'));

const handleGetWeatherInformation = async (req, res) => {
    const lat = req.params.lat
    const lon = req.params.lon
    const packageRes = await weatherService.getWeatherInfo(lat, lon, redisClient)
    res.json({ ...packageRes })
    packageRes.errCode === 0 ? res.status(201) : res.status(406)
    return res
}

module.exports = {
    handleGetWeatherInformation
}