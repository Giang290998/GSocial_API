import JWTAction from '../utils/JWTAction'

const requireToken = (req, res, next) => {
    const isLoginPath = req.path.includes('/api/user/login') ? true : false
    const isPassCondition = (
        req.path === '/api/user/create' || req.path === '/api/token/refresh' || isLoginPath
    )
    if (isPassCondition) {
        return next()
    } else {
        const accessToken = req.headers.accesstoken
        if (accessToken) {
            const token = accessToken.split(" ")[1]
            const payload = JWTAction.verifyAccessToken(token)
            const date = new Date()
            const time =  date.getTime()/1000
            if (payload) {
                if (payload.exp > time) {
                    return next()
                } else {
                    res.status(400).json({
                        errCode: 1,
                        errMessage: "Token has expired."
                    })
                    return res
                }
            } else {
                res.status(400).json({
                    errCode: 2,
                    errMessage: "Token is not valid."
                })
                return res
            }
        } else {
            res.status(400).json({
                errCode: 3,
                errMessage: "Token is empty."
            })
            return res
        }
    }
}

module.exports = { requireToken }