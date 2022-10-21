import JWTAction from '../utils/JWTAction'

const handleRenewToken = (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        const accessToken = req.headers.accesstoken
        if (!refreshToken || !accessToken) {
            let resPackage = { errCode: 1 }
            if (!refreshToken) {
                resPackage.errMessage = "Refresh token is empty."
            }
            resPackage.errMessage = "Access token is empty."
            return res.status(401).json({ ...resPackage })
        } else {
            const payloadRefreshToken = JWTAction.verifyRefreshToken(refreshToken)
            if (payloadRefreshToken) {
                const payload = {
                    userId: payloadRefreshToken.userId,
                    roleId: payloadRefreshToken.roleId
                }
                const newAccessToken = JWTAction.createAccessToken(payload)
                const newRefreshToken = JWTAction.createRefreshToken(payload)
                res.cookie("refreshToken", newRefreshToken,
                    // {
                    //     httpOnly: true,
                    //     sameSite: "strict",
                    //     secure: false,
                    // }
                )
                res.json({
                    errCode: 0, 
                    message: "Token has been refreshed.",
                    newAccessToken: newAccessToken 
                })
                res.status(201)
                return res
            } else {
                res.json({
                    errCode: 2,
                    errMessage: "Token is not valid."
                })
                res.status(401)
                return res
            }
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = { handleRenewToken, }