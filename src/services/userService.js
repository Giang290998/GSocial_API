import db from '../models/index';
import bcrypt from 'bcryptjs';
import JWTAction from '../utils/JWTAction';
import chatService from './chatService';

/*------------------------------------------------------ Main function ---------------------------------------------------------*/

let createNewUser = (id, password, firstName, lastName, sex, dateOfBirth, avatar) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReturn = {} 
            let userExist = await checkUserExist(id)
            if (userExist) {
                dataReturn.errCode = 1
                dataReturn.errMessage = "User already exist! Can not create this user."
                resolve(dataReturn)
            } else {
                const createUserDev = db.UserDevelopment.create({ 
                    userId: id,
                    password: bcrypt.hashSync(password, 10),
                })
                const createUserInfo = db.UserInfo.create({ 
                    userId: id,
                    firstName: firstName, 
                    lastName: lastName, 
                    sex: sex.toString(),
                    dateOfBirth: dateOfBirth,
                    avatar: avatar ? avatar : null
                })
                await Promise.all([createUserDev, createUserInfo])
                dataReturn.errCode = 0
                dataReturn.message = 'The request has been fulfilled, new user created !'
                resolve(dataReturn)
            }
        } catch (error) {
            reject(error)
        }
    })
}

let login = (id, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const idLogin = id.toString()
            const passwordLogin = password.toString()
            let dataReturn = {}
            const checkCode = await checkUserMatch(idLogin, passwordLogin)
            switch (checkCode) {
                case 0:
                    dataReturn = await getInformationUserLogin(idLogin)
                    resolve(dataReturn)
                    break;
                case 1:
                    dataReturn.errCode = 1
                    dataReturn.errMessage = "Wrong password."
                    resolve(dataReturn)
                    break;
                case 2:
                    dataReturn.errCode = 2
                    dataReturn.errMessage = "Wrong ID. User does not exist."
                    resolve(dataReturn)
                    break;
                default:
                    break;
            }
        } catch (error) {
            reject(error)
        }
    })
}

let loginWithEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReturn = {}
            const userInfo = db.UserInfo.findOne({ where: { userId: email } })
            const userDev = db.UserDevelopment.findOne({ where: { userId: email } })
            const user = await Promise.all([userDev, userInfo])
            if (user[0] && user[1]) {
                dataReturn = await getInformationUserLogin(email)
                resolve(dataReturn)
            } else {
                dataReturn.errCode = 1
                dataReturn.errMessage = "User doesn't exist."
                resolve(dataReturn)
            }
        } catch (error) {
            reject(error)
        }
    })
}

let loginWithRememberToken = (rememberToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReturn = {}
            const payload = JWTAction.verifyRememberToken(rememberToken)
            if (payload) {
                dataReturn = await getInformationUserLogin(payload.userId)
                resolve(dataReturn)
            } else {
                dataReturn.errCode = 1
                dataReturn.errMessage = "Invalid remember token!"
                resolve(dataReturn)
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getInfoProfileUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReturn = {}
            let userInfo = await db.UserInfo.findOne({ where: { userId: id } })
            let friendInfo = null
            if (userInfo.friend) {
                const friendId = JSON.parse(userInfo.friend)
                const friendInfoPromise = friendId.map(id => db.UserInfo.findOne({ where: { userId: id } }))
                friendInfo = await Promise.all([ ...friendInfoPromise ])
            }
            dataReturn.errCode = 0
            dataReturn.message = "OK!"
            dataReturn.userInformation = userInfo
            dataReturn.friendInfo = friendInfo
            resolve(dataReturn)
        } catch (error) {
            reject(error)
        }
    })
}

let updateUser = (id, restInfo) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReturn = {}
            let isExist = await checkUserExist(id)
            if (isExist) {
                dataReturn.errCode = 0
                for (const key in restInfo) {
                    switch (key) {
                        case "avatar":
                            let avatarUpdate = restInfo.avatar
                            await updateAvatarUser(avatarUpdate, id)
                            dataReturn.message_avatar = "Avatar user has been updated!"
                            break;

                        case "friend":
                            let friendUpdate = restInfo.friend
                            let messReturn = await updateFriendUser(friendUpdate, id)
                            dataReturn.message_friend = messReturn
                            break;

                        case "passwordNew":
                            let passwordUpdate = restInfo.password
                            await db.UserDevelopment.update({ password: bcrypt.hashSync(passwordUpdate, 10) }, { where: { userId: id } })
                            dataReturn.message_password = `Updated password become: ${passwordUpdate}`
                            break;
    
                        case "firstName":
                            let firstNameUpdate = restInfo.firstName
                            await db.UserInfo.update({ firstName: firstNameUpdate }, { where: { userId: id } })
                            dataReturn.message_firstName = `Updated first name become: ${firstNameUpdate}`
                            break;
    
                        case "lastName":
                            let lastNameUpdate = restInfo.lastName
                            await db.UserInfo.update({ lastName: lastNameUpdate }, { where: { userId: id } })
                            dataReturn.message_lastName = `Updated last name become: ${lastNameUpdate}`
                            break;

                        default:
                            break;
                    }
                }
                dataReturn.messageFinal = "The request has been fulfilled. User's information has been updated!"
                resolve(dataReturn)
            } else {
                if (err === 1) {
                    dataReturn.errCode = 1
                    dataReturn.errMessage = "Wrong password."
                    resolve(dataReturn)
                } else {
                    dataReturn.errCode = 2
                    dataReturn.errMessage = "Wrong ID. User does not exist."
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

let createFriendRequest = (fromUser, toUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReturn = {}
            await db.FriendRequest.create({
                fromUserId: fromUser,
                toUserId: toUser,
            })
            dataReturn.errCode = 0
            dataReturn.message = 'OK. New friend request created.'
            resolve(dataReturn)
        } catch (error) {
            reject(error)
        }
    })
}

let deleteFriendRequest = (fromUser, toUser, isAccept) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReturn = {}
            if (isAccept) {
                const userA = db.UserInfo.findOne({ where: { userId: fromUser }})
                const userB = db.UserInfo.findOne({ where: { userId: toUser }})
                const user = await Promise.all([userA, userB])
                const friendUserA = user[0].friend ? JSON.parse(user[0].friend) : null
                const friendUserB = user[1].friend ? JSON.parse(user[1].friend) : null
                const newFriendUserA = friendUserA ? [ ...(friendUserA), toUser ] : [ toUser ]
                const newFriendUserB = friendUserB ? [ ...(friendUserB), fromUser ] : [ fromUser ]
                const updateFriendUserA = db.UserInfo.update({ friend: JSON.stringify(newFriendUserA) }, { where: { userId: fromUser } })
                const updateFriendUserB = db.UserInfo.update({ friend: JSON.stringify(newFriendUserB) }, { where: { userId: toUser } })
                const deleteRequest = db.FriendRequest.destroy({ where: { fromUserId: fromUser, toUserId: toUser } })
                await Promise.all([updateFriendUserA, updateFriendUserB, deleteRequest])
                dataReturn.message = `OK. User: ${fromUser} and ${toUser} now is friend.`
            } else {
                await db.FriendRequest.destroy({ where: { fromUserId: fromUser, toUserId: toUser } })
                dataReturn.message = 'OK. Deleted friend request.'
            }
            dataReturn.errCode = 0
            resolve(dataReturn)
        } catch (error) {
            reject(error)
        }
    })
}

/*----------------------------------------------------- Children function --------------------------------------------------------*/

let updateAvatarUser = async (avatarUpdate, id) => {
    await db.UserInfo.update({ avatar: avatarUpdate }, { where: { userId: id } })
}

let updateFriendUser = (friendUpdate, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.UserInfo.findOne({ where: { userId: id }})
            const friendArr = JSON.parse(user.friend)
            let newFriendArr = []
            let message = ""
            if (friendArr === null) {
                newFriendArr = [ friendUpdate ]
                await db.UserInfo.update({ friend: JSON.stringify(newFriendArr) }, { where: { userId: id } })
                message = `Add friend: ${friendUpdate} successfully!`
                resolve(message)
            } else {
                if (friendArr.includes(friendUpdate)) {
                    const deleteIndex = friendArr.indexOf(friendUpdate)
                    friendArr.splice(deleteIndex, 1)
                    newFriendArr = friendArr
                    await db.UserInfo.update({ friend: JSON.stringify(newFriendArr) }, { where: { userId: id } })
                    message = `Remove friend: ${friendUpdate} successfully!`
                    resolve(message)
                } else {
                    newFriendArr = [...friendArr, friendUpdate]
                    await db.UserInfo.update({ friend: JSON.stringify(newFriendArr) }, { where: { userId: id } })
                    message = `Add friend: ${friendUpdate} successfully!`
                    resolve(message)
                }
            }
        } catch (error) {
            reject(error)
        }
    })
     
}

let checkUserExist = (userIdCheck) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.UserDevelopment.findOne({ where: { userId: userIdCheck }})
            user ? resolve(true) : resolve(false)
        } catch (error) {
            reject(error)
        }
    })
}
let checkUserMatch = (idCheck, passwordCheck) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.UserDevelopment.findOne({ where: { userId: idCheck }})
            if (user) {
                await bcrypt.compare(passwordCheck, user.password) ? resolve(0) : resolve(1)
            } else {
                resolve(2)
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getInformationUserLogin = async (id) => {
    let dataReturn = {}
    const userInfo = db.UserInfo.findOne({ where: { userId: id } })
    const userDev = db.UserDevelopment.findOne({ where: { userId: id } })
    const friendRequestPromise = db.FriendRequest.findAll({ where: { fromUserId: id } })
    const promise = await Promise.all([userDev, userInfo, friendRequestPromise])
    const friendRequest = promise[2] ? promise[2].map(item => item.toUserId) : null
    let friendInfo = null
    if (promise[1].friend) {
        const friendId = JSON.parse(promise[1].friend)
        const friendInfoPromise = friendId.map(id => db.UserInfo.findOne({ where: { userId: id } }))
        friendInfo = await Promise.all([ ...friendInfoPromise ])
    }
    if (promise[1].chatRoom) {
        await chatService.modifiedAllMessageStatus(promise[1].userId, promise[1].chatRoom, 'received')
    }
    dataReturn.errCode = 0
    dataReturn.message = "OK!"
    dataReturn.userInformation = { roleId: promise[0].roleId, ...promise[1], friendRequest: friendRequest }
    dataReturn.friendInfo = friendInfo
    return dataReturn
}

module.exports = {
    createNewUser, login, updateUser, checkUserExist, 
    getInfoProfileUser, loginWithRememberToken, loginWithEmail,
    createFriendRequest, deleteFriendRequest,
}