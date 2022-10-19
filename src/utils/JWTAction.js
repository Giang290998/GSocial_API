import jwt from "jsonwebtoken";
require('dotenv').config();

const createAccessToken = (payload) => {
    let key = process.env.JWT_ACCESS_KEY
    let token = null
    try {
        token = jwt.sign({ ...payload }, key, { expiresIn: "1h" })
    } catch (error) {
        console.log(error)
    }
    return token
}

const verifyAccessToken = (token) => {
    let key = process.env.JWT_ACCESS_KEY
    let data = null
    try {
        data = jwt.verify(token, key)
    } catch (error) {
        console.log(error)
    }
    return data
}

const createRefreshToken = (payload) => {
    let key = process.env.JWT_REFRESH_KEY
    let token = null
    try {
        token = jwt.sign({ ...payload }, key, { expiresIn: "7d" })
    } catch (error) {
        console.log(error)
    }
    return token
}

const verifyRefreshToken = (token) => {
    let key = process.env.JWT_REFRESH_KEY
    let data = null
    try {
        data = jwt.verify(token, key)
    } catch (error) {
        console.log(error)
    }
    return data
}

const createRememberToken = (payload) => {
    let key = process.env.JWT_REMEMBER_KEY
    let token = null
    try {
        token = jwt.sign({ ...payload }, key, { expiresIn: "1y" })
    } catch (error) {
        console.log(error)
    }
    return token
}

const verifyRememberToken = (token) => {
    let key = process.env.JWT_REMEMBER_KEY
    let data = null
    try {
        data = jwt.verify(token, key)
    } catch (error) {
        console.log(error)
    }
    return data
}

module.exports = { 
    createAccessToken, verifyAccessToken, createRefreshToken, verifyRefreshToken, createRememberToken,
    verifyRememberToken,  
}
