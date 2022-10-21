import userService from '../services/userService';
import JWTAction from '../utils/JWTAction'

const handleCreateUser = async (req, res) => {
    try {
        const { id, password, firstName, lastName, sex, dateOfBirth, avatar } = req.body
        let packageRes = null
        if (avatar !== null) {
            packageRes = await userService.createNewUser(id, randomPassword(12), firstName, lastName, sex, dateOfBirth, avatar)
        } else {
            packageRes = await userService.createNewUser(id, password, firstName, lastName, sex, dateOfBirth, avatar)
        }
        res.json({ ...packageRes })
        packageRes.errCode === 0 ? res.status(201) : res.status(406)
        return res
    } catch (error) {
        console.log(error)
    }

}

const handleLoginUser = async (req, res) => {
    try {
        const id = req.params.id
        const password = req.params.password
        const packageRes = await userService.login(id, password)
        if (packageRes.errCode === 0) {
            const payload = { 
                userId: packageRes.userInformation.userId,
                roleId: packageRes.userInformation.roleId 
            }
            const accessToken = JWTAction.createAccessToken(payload)
            const refreshToken = JWTAction.createRefreshToken(payload)
            const rememberToken = JWTAction.createRememberToken(payload)
            packageRes.accessToken = accessToken
            packageRes.rememberToken = rememberToken
            res.cookie("refreshToken", refreshToken,
                {
                    httpOnly: true,
                    sameSite: "strict",
                    secure: true,
                }
            )
        }
        res.json({ ...packageRes })
        packageRes.errCode === 0 ? res.status(200) : res.status(400)
        return res
    } catch (error) {
        console.log(error)
        res.status(400)
        res.json({ error: 'BAD REQUEST'})
        return res
    }
}

const handleLoginWithEmail = async (req, res) => {
    try {
        const email = req.params.email
        const packageRes = await userService.loginWithEmail(email)
        if (packageRes.errCode === 0) {
            const payload = { 
                userId: packageRes.userInformation.userId,
                roleId: packageRes.userInformation.roleId 
            }
            const accessToken = JWTAction.createAccessToken(payload)
            const refreshToken = JWTAction.createRefreshToken(payload)
            const rememberToken = JWTAction.createRememberToken(payload)
            packageRes.accessToken = accessToken
            packageRes.rememberToken = rememberToken
            res.cookie("refreshToken", refreshToken,
                {
                    httpOnly: true,
                    sameSite: "strict",
                    secure: true,
                }
            )
        }
        res.json({ ...packageRes })
        packageRes.errCode === 0 ? res.status(200) : res.status(400)
        return res
    } catch (error) {
        console.log(error)
    }
}

const handleLoginWithRememberToken = async (req, res) => {
    try {
        const rememberToken = req.params.token
        const packageRes = await userService.loginWithRememberToken(rememberToken)
        if (packageRes.errCode === 0) {
            const payload = { 
                userId: packageRes.userInformation.userId,
                roleId: packageRes.userInformation.roleId 
            }
            const accessToken = JWTAction.createAccessToken(payload)
            const refreshToken = JWTAction.createRefreshToken(payload)
            packageRes.accessToken = accessToken
            res.cookie("refreshToken", refreshToken,
                {
                    httpOnly: true,
                    sameSite: "strict",
                    secure: true,
                }
            )
        }
        res.json({ ...packageRes })
        packageRes.errCode === 0 ? res.status(200) : res.status(400)
        return res
    } catch (error) {
        console.log(error)
    }
}

const handleGetInfoProfileUser = async (req, res) => {
    try {
        const id = req.params.id
        const packageRes = await userService.getInfoProfileUser(id)
        res.json({ ...packageRes })
        packageRes.errCode === 0 ? res.status(200) : res.status(400)
        return res
    } catch (error) {
        console.log(error)
    }
}

const handleUpdateUser = async (req, res) => {
    try {
        const { id, ...restInfo } = req.body
        const packageRes = await userService.updateUser(id, restInfo)
        res.json({ ...packageRes })
        packageRes.errCode === 0 ? res.status(200) : res.status(400)
        return res
    } catch (error) {
        console.log(error)
    }
}

const handleCreateFriendRequest = async (req, res) => {
    try {
        const { fromUser, toUser } = req.body
        let packageRes = await userService.createFriendRequest(fromUser, toUser)
        res.json({ ...packageRes })
        packageRes.errCode === 0 ? res.status(201) : res.status(406)
        return res
    } catch (error) {
        console.log(error)
    }
}

const handleDeleteFriendRequest = async (req, res) => {
    try {
        const { fromUser, toUser, isAccept } = req.body
        let packageRes = await userService.deleteFriendRequest(fromUser, toUser, isAccept)
        res.json({ ...packageRes })
        packageRes.errCode === 0 ? res.status(200) : res.status(400)
        return res
    } catch (error) {
        console.log(error)
    }
}

function randomPassword(length) {
    let result = ''
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let charactersLength = characters.length
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

module.exports = {
    handleCreateUser, handleLoginUser, handleUpdateUser, handleGetInfoProfileUser,
    handleLoginWithRememberToken, handleLoginWithEmail, handleCreateFriendRequest,
    handleDeleteFriendRequest,
}