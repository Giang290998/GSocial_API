import chatService from '../services/chatService';

const handleCreateNormalChat = async (req, res) => {
    try {
        let { fromUser, toUser, messageType, messageContent, messageStatus } = req.body
        let packageRes = await chatService.createFirstMessageNormal(fromUser, toUser, messageType, messageContent)
        res.json({ ...packageRes })
        packageRes.errCode === 0 ? res.status(201) : res.status(400)
        return res
    } catch (error) {
        console.log(error)
    }
}

const handleCreateMessage = async (req, res) => {
    try {
        let { roomId, userId, messageType, messageContent, messageStatus, idTempo } = req.body
        let packageRes = await chatService.createMessage(roomId, userId, messageType, messageContent, messageStatus, idTempo)
        res.json({ ...packageRes })
        packageRes.errCode === 0 ? res.status(201) : res.status(400)
        return res
    } catch (error) {
        console.log(error)
    }
}

const handleModifiedMessage = async (req, res) => {
    try {
        let { messageId, ...modifiedField} = req.body
        let packageRes = await chatService.modifiedMessage(messageId, modifiedField)
        res.json({ ...packageRes })
        packageRes.errCode === 0 ? res.status(200) : res.status(400)
        return res
    } catch (error) {
        console.log(error)
    }
}

const handleModifiedStatusManyMessage = async (req, res) => {
    try {
        let { roomId, roomRole, newStatus, userId } = req.body
        let packageRes = await chatService.modifiedStatusOfManyMessage(roomId, roomRole, newStatus, userId)
        res.json({ ...packageRes })
        packageRes.errCode === 0 ? res.status(200) : res.status(400)
        return res
    } catch (error) {
        console.log(error)
    }
}

const handleModifiedAllMessageStatus = async (req, res) => {
    try {
        let { userId, allRoomId, newStatus } = req.body
        let packageRes = await chatService.modifiedAllMessageStatus(userId, allRoomId, newStatus)
        res.json({ ...packageRes })
        packageRes.errCode === 0 ? res.status(200) : res.status(400)
        return res
    } catch (error) {
        console.log(error)
    }

}

const handleGetAllMessage = async (req, res) => {
    try {
        let idRoomString = req.body.idRoomString
        let packageRes = await chatService.getAllMessage(idRoomString)
        res.json({ ...packageRes })
        packageRes.errCode === 0 ? res.status(200) : res.status(400)
        return res
    } catch (error) {
        console.log(error)
    }

}

module.exports = {
    handleCreateNormalChat, handleGetAllMessage, handleCreateMessage,
    handleModifiedMessage, handleModifiedStatusManyMessage,
    handleModifiedAllMessageStatus, 
}