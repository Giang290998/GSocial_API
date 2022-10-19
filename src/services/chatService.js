import db from '../models/index';

let createFirstMessageNormal = (fromUser, toUser, messageType, messageContent) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReturn = {}
            const allUserId = [fromUser, toUser]
            const createChatRoom = await db.ChatRoom.create({ allUserId: JSON.stringify(allUserId) })
            const userA = db.UserInfo.findOne({ where: { userId: fromUser }})
            const userB = db.UserInfo.findOne({ where: { userId: toUser }})
            const user = await Promise.all([userA, userB])
            const chatRoomUserA = addChatRoom(user[0], createChatRoom.id)
            const chatRoomUserB = addChatRoom(user[1], createChatRoom.id)
            const saveChatRoomToUserA = db.UserInfo.update({ chatRoom: JSON.stringify(chatRoomUserA) }, { where: { userId: fromUser} })
            const saveChatRoomToUserB = db.UserInfo.update({ chatRoom: JSON.stringify(chatRoomUserB) }, { where: { userId: toUser} })
            const createMessage = db.Message.create({
                chatRoomId: createChatRoom.id, 
                userId: fromUser,
                messageType: messageType,
                messageContent: messageContent,
                messageStatus: 'sent',
            })
            await Promise.all([saveChatRoomToUserA, saveChatRoomToUserB, createMessage])
            dataReturn.errCode = 0
            dataReturn.message = `OK! Created new chat room.`
            dataReturn.chatRoom = createChatRoom
            resolve(dataReturn)
        } catch (error) {
            reject(error)
        }
        function addChatRoom(user, id) {
            if(user.chatRoom) {
                let oldChatIdArr = JSON.parse(user.chatRoom)
                let newChatIdArr = [ ...oldChatIdArr, id]
                return newChatIdArr
            } else {
                return [id]
            }
        }
    })
}

let createMessage = (roomId, userId, messageType, messageContent, messageStatus, idTempo) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReturn = {}
            let newMessage = await db.Message.create({
                chatRoomId: roomId,
                userId,
                messageType,
                messageContent,
                messageStatus,
            })
            dataReturn.errCode = 0
            dataReturn.message = 'OK. Created new message.'
            dataReturn.messageCreate = newMessage
            dataReturn.idTempo = idTempo
            resolve(dataReturn)
        } catch (error) {
            reject(error)
        }
    })
}

let modifiedMessage = (messageId, modifiedField) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReturn = {}
            dataReturn.errCode = 0
            for (const key in modifiedField) {
                switch (key) {
                    case 'messageStatus':
                        const newStatus = modifiedField.messageStatus
                        await db.Message.update({ messageStatus: newStatus }, { where: { id: messageId }})
                        dataReturn.message = `Updated message ${messageId} to ${newStatus} status.`
                        break;
                
                    default:
                        break;
                }
            }
            resolve(dataReturn)
        } catch (error) {
            reject(error)
        }
    })
}

let modifiedStatusOfManyMessage = (roomId, roomRole, newStatus, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReturn = {}
            if (roomRole === 'normal') {
                const statusFind = newStatus === 'received' ? 'sent' : 'received'
                const messageModified = await db.Message.findAll({ where: { chatRoomId: roomId, messageStatus: statusFind, userId }})
                const updatePromise = messageModified.map(message => 
                    db.Message.update({ messageStatus: newStatus }, { where: { id: message.id }})
                )
                await Promise.all([ ...updatePromise ])
                dataReturn.errCode = 0
                dataReturn.message = `Updated all message in room ${roomRole} status from ${statusFind} to ${newStatus}`
            }
            if (roomRole === 'group') {
                
            }
            resolve(dataReturn)
        } catch (error) {
            reject(error)
        }
    })
}

let modifiedAllMessageStatus = (userId, allRoomId, newStatus) => {
    return new Promise(async (resolve, reject) => {
        let dataReturn = {}
        try {
            dataReturn.errCode = 0
            const idRoomArr = JSON.parse(allRoomId)
            let allUpdateMessagePromise = []
            if (newStatus === 'received') {
                const allMessageStatusSentInRoomPromise = idRoomArr.map(id => 
                    db.Message.findAll({ where: { chatRoomId: id, messageStatus: 'sent', userId: !userId }})
                )
                const allMessageFind = await Promise.all([ ...allMessageStatusSentInRoomPromise ])
                allMessageFind.forEach(allMessageInRoom => {
                    const updateMessagePromise = allMessageInRoom.map(message => {
                        if (message.userId !== userId) { 
                            return db.Message.update({ messageStatus: 'received' }, { where: { id: message.id }})    
                        }
                    })
                    allUpdateMessagePromise = [ ...allUpdateMessagePromise, updateMessagePromise ]
                })
                await Promise.all([ ...allUpdateMessagePromise ])
                dataReturn.message = 'OK.'
            } else {
 
            }
            resolve(dataReturn)
        } catch (error) {
            reject(error)
        }
    })
}

let getAllMessage = (idRoomString) => {
    return new Promise(async (resolve, reject) => {
        try {
            const idRoomArr = JSON.parse(idRoomString)
            let dataReturn = {}
            let chatRoomDetail = []
            let chatRoomMemberAvatar = []
            let chatRoomMemberFullName = []
            let chatRoomUserId = []
            for (let i = 0; i < idRoomArr.length; i++) {
                const chatRoom = await db.ChatRoom.findOne({ where: { id: idRoomArr[i] }})
                const userIdMemberRoomArr = JSON.parse(chatRoom.allUserId) 
                chatRoomUserId.push(userIdMemberRoomArr)
                let avatarMemberRoom = []
                let fullNameMemberRoom = []
                for (let j = 0; j < userIdMemberRoomArr.length; j++) {
                    const member = await db.UserInfo.findOne({ where: { userId: userIdMemberRoomArr[j] }})
                    fullNameMemberRoom.push(`${member.firstName+' '+member.lastName}`)
                    member.avatar
                        ? avatarMemberRoom.push(member.avatar)
                        : avatarMemberRoom.push(null)          
                }
                chatRoomMemberAvatar.push(avatarMemberRoom)
                chatRoomMemberFullName.push(fullNameMemberRoom)
            }
            for (let i = 0; i < idRoomArr.length; i++) {
                const mess = await db.Message.findAll({ where: { chatRoomId: idRoomArr[i] }}) 
                chatRoomDetail.push(mess)
            }
            dataReturn.errCode = 0
            dataReturn.message = 'OK'
            dataReturn.chat = {
                chatRoomDetail,
                chatRoomMemberAvatar,
                chatRoomMemberFullName,
                chatRoomUserId,
            }
            resolve(dataReturn)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createFirstMessageNormal, getAllMessage, createMessage, modifiedMessage,
    modifiedStatusOfManyMessage, modifiedAllMessageStatus,
}