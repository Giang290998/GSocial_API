import db from '../models/index';

let getNotification = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReturn = {}
            const allFriendRequest = await db.FriendRequest.findAll({ where: { toUserId: userId }})
            const userInfoPromise = allFriendRequest.map(friendRequest => 
                db.UserInfo.findOne({ where: {userId: friendRequest.fromUserId}}))
            const allUserRequest = await Promise.all([ ...userInfoPromise ])
            const allRequestResponse = allUserRequest.map((user, index) => { 
                const userModified = { ...user, requestCreatedAt: allFriendRequest[index].createdAt }
                return userModified
            })
            allRequestResponse.reverse()
            dataReturn.errCode = 0
            dataReturn.allFriendRequest = allRequestResponse
            resolve(dataReturn)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    getNotification, 
}
