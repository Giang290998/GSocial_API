import commentService from '../services/commentService'

let handleCreateComment = async (req, res) => {
    const { postId, parentCommentId, replyCommentId, idTempo, userId, commentType, commentContent } = req.body
    if (postId && !parentCommentId && !replyCommentId) {
        let packageRes = await commentService.createParentComment(postId, userId, commentType, commentContent, idTempo)
        res.json({ ...packageRes })
        packageRes.errCode === 0 ? res.status(201) : res.status(400)
    }
    if (postId && parentCommentId) {
        let packageRes = await commentService.createReplyComment(postId, parentCommentId, userId, commentType, commentContent, idTempo)
        res.json({ ...packageRes })
        packageRes.errCode === 0 ? res.status(201) : res.status(400)
    } 
    if (postId && replyCommentId) {
        let packageRes = 
        await commentService.createReplyChildComment(postId, replyCommentId, userId, commentType, commentContent, idTempo)
        res.json({ ...packageRes })
        packageRes.errCode === 0 ? res.status(201) : res.status(400)
    }
    return res
}

let handleGetComment = async (req, res) => {
    const { postId, offSet, parentCommentId, replyCommentId } = req.body
    if (postId) {
        let packageRes = await commentService.getParentComment(postId, offSet)
        res.json({ ...packageRes })
        packageRes.errCode === 0 ? res.status(200) : res.status(400)
    }
    if (parentCommentId) {
        let packageRes = await commentService.getReplyComment(parentCommentId)
        res.json({ ...packageRes })
        packageRes.errCode === 0 ? res.status(200) : res.status(400)            
    } 
    if (replyCommentId){
        let packageRes = await commentService.getReplyChildComment(replyCommentId)
        res.json({ ...packageRes })
        packageRes.errCode === 0 ? res.status(200) : res.status(400)              
    }
    return res
}

let handleUpdateComment = async (req, res) => {
    let { action, ...payload } = req.body
    
    let packageRes = await commentService.updateComment(action, payload)

    res.json({ ...packageRes })

    packageRes.errCode === 0 ? res.status(200) : res.status(400)

    return res
}

module.exports = { handleCreateComment, handleGetComment, handleUpdateComment, }