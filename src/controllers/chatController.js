import chatService from '../services/chatService';

const handleCreateNormalChat = async (req, res) => {
    let { fromUser, toUser, messageType, messageContent, messageStatus } = req.body
    let packageRes = await chatService.createFirstMessageNormal(fromUser, toUser, messageType, messageContent)
    res.json({ ...packageRes })
    packageRes.errCode === 0 ? res.status(201) : res.status(400)
    return res
}

const handleCreateMessage = async (req, res) => {
    let { roomId, userId, messageType, messageContent, messageStatus, idTempo } = req.body
    let packageRes = await chatService.createMessage(roomId, userId, messageType, messageContent, messageStatus, idTempo)
    res.json({ ...packageRes })
    packageRes.errCode === 0 ? res.status(201) : res.status(400)
    return res
}

const handleModifiedMessage = async (req, res) => {
    let { messageId, ...modifiedField} = req.body
    let packageRes = await chatService.modifiedMessage(messageId, modifiedField)
    res.json({ ...packageRes })
    packageRes.errCode === 0 ? res.status(200) : res.status(400)
    return res
}

const handleModifiedStatusManyMessage = async (req, res) => {
    let { roomId, roomRole, newStatus, userId } = req.body
    let packageRes = await chatService.modifiedStatusOfManyMessage(roomId, roomRole, newStatus, userId)
    res.json({ ...packageRes })
    packageRes.errCode === 0 ? res.status(200) : res.status(400)
    return res
}

const handleModifiedAllMessageStatus = async (req, res) => {
    let { userId, allRoomId, newStatus } = req.body
    let packageRes = await chatService.modifiedAllMessageStatus(userId, allRoomId, newStatus)
    res.json({ ...packageRes })
    packageRes.errCode === 0 ? res.status(200) : res.status(400)
    return res
}

const handleGetAllMessage = async (req, res) => {
    let idRoomString = req.body.idRoomString
    let packageRes = await chatService.getAllMessage(idRoomString)
    res.json({ ...packageRes })
    packageRes.errCode === 0 ? res.status(200) : res.status(400)
    return res
}

module.exports = {
    handleCreateNormalChat, handleGetAllMessage, handleCreateMessage,
    handleModifiedMessage, handleModifiedStatusManyMessage,
    handleModifiedAllMessageStatus, 
}