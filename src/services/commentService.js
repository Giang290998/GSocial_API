import db from "../models/index";

let createParentComment = (postId, userId, commentType, commentContent, idTempo) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReturn = {}
            const post = await db.Post.findOne({ where: { id: postId }})
            const oldComment = post.comment
            const newComment = oldComment 
                ? 
                { ...oldComment, 
                    totalComment: oldComment.totalComment + 1, 
                    totalParentComment: oldComment.totalParentComment + 1 
                } 
                : 
                { totalComment: 1, totalParentComment: 1 }
            const updateNumberCommentPost = db.Post.update({ comment: newComment }, { where: { id: postId } })
            const newParentComment = db.ParentComment.create({
                postId: postId,
                userId: userId,
                commentType: commentType,
                commentContent: commentContent,
            })
            const promiseResult = await Promise.all([newParentComment, updateNumberCommentPost])
            dataReturn.errCode = 0
            dataReturn.message = "OK. Created new parent comment."
            dataReturn.idTempo = idTempo
            dataReturn.newParentComment = promiseResult[0]
            setTimeout(() => {
                resolve(dataReturn)
            }, 1000)
        } catch (error) {
            reject(error)
        }
    })
}

let createReplyComment = (postId, parentCommentId, userId, commentType, commentContent, idTempo) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReturn = {}
            const post = db.Post.findOne({ where: { id: postId }})
            const parentComment = db.ParentComment.findOne({ where: { id: parentCommentId }})
            const promiseFind = await Promise.all([post, parentComment])
            const oldComment = promiseFind[0].comment
            const newComment = oldComment 
                ? { ...oldComment, totalComment: oldComment.totalComment + 1 } 
                : { totalComment: 1 }
            const updateNumberCommentPost = db.Post.update({ comment: newComment }, { where: { id: postId } })
            const oldReplyComment = promiseFind[1].replyComment
            const newReplyCommentObj = oldReplyComment
                ? { ...oldReplyComment, totalReplyComment: oldReplyComment.totalReplyComment + 1}
                : { totalReplyComment: 1 }
            const updateNumberReplyParentComment = 
                db.ParentComment.update({ replyComment: newReplyCommentObj }, { where: { id: parentCommentId }})
            const newReplyComment = db.ReplyComment.create({
                parentCommentId: parentCommentId,
                userId: userId,
                commentType: commentType,
                commentContent: commentContent,
            })
            const promiseUpdate = await Promise.all([newReplyComment, updateNumberCommentPost, updateNumberReplyParentComment])
            dataReturn.errCode = 0
            dataReturn.message = "OK. Created new reply comment."
            dataReturn.idTempo = idTempo
            dataReturn.newReplyComment = promiseUpdate[0]
            setTimeout(() => {
                resolve(dataReturn)
            }, 1000)
        } catch (error) {
            reject(error)
        }
    })
}

let createReplyChildComment = (postId, replyCommentId, userId, commentType, commentContent, idTempo) => {
    return new Promise(async (resolve, reject) => {
        try {   
            let dataReturn = {}
            const post = db.Post.findOne({ where: { id: postId }})
            const replyComment = db.ReplyComment.findOne({ where: { id: replyCommentId }})
            const promiseFind = await Promise.all([post, replyComment])
            const oldComment = promiseFind[0].comment
            const newComment = oldComment 
                ? { ...oldComment, totalComment: oldComment.totalComment + 1 } 
                : { totalComment: 1 }
            const updateNumberCommentPost = db.Post.update({ comment: newComment }, { where: { id: postId } })

            const oldReplyChildComment = promiseFind[1].replyChildComment
            const newReplyChildCommentObj = oldReplyChildComment
                ? { ...oldReplyChildComment, totalReplyChildComment: oldReplyChildComment.totalReplyChildComment + 1 }
                : { totalReplyChildComment: 1 }
            const updateNumberReplyOfReplyComment = 
                db.ReplyComment.update({ replyChildComment: newReplyChildCommentObj }, { where: { id: replyCommentId }})
            const newReplyChildComment = db.ReplyChildComment.create({
                replyCommentId: replyCommentId,
                userId: userId,
                commentType: commentType,
                commentContent: commentContent,
            })
            const promiseUpdate = await Promise.all([newReplyChildComment, updateNumberCommentPost, updateNumberReplyOfReplyComment])
            dataReturn.errCode = 0
            dataReturn.message = "OK. Created new reply child comment."
            dataReturn.idTempo = idTempo
            dataReturn.newReplyChildComment = promiseUpdate[0]
            setTimeout(() => {
                resolve(dataReturn)
            }, 1000)
        } catch (error) {
            reject(error)
        }
    })
}

let getParentComment = (postId, offSet) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReturn = {}
            let parentCommentArr = await db.ParentComment.findAll({ offset: offSet, limit: 5, where: { postId: postId } })
            let newParentCommentArr = []
            for (const parentComment of parentCommentArr) {
                const user = await db.UserInfo.findOne({ where: { userId: parentComment.userId }})
                parentComment = {
                    userFullName: `${user.firstName+" "+user.lastName}`,
                    userAvatar: user.avatar,
                    ...parentComment
                }
                newParentCommentArr.push(parentComment)
            }
            dataReturn.errCode = 0
            dataReturn.message = `OK. Parent comment of postID: ${postId}`
            dataReturn.parentComment = newParentCommentArr
            resolve(dataReturn)
        } catch (error) {
            reject(error)
        }
    })
}

let getReplyComment = (parentCommentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReturn = {}
            let childCommentArr = await db.ReplyComment.findAll({ where: { parentCommentId: parentCommentId } })
            let newReplyCommentArr = []
            for (const replyComment of childCommentArr) {
                const user = await db.UserInfo.findOne({ where: { userId: replyComment.userId }})
                replyComment = {
                    userFullName: `${user.firstName+" "+user.lastName}`,
                    userAvatar: user.avatar,
                    ...replyComment
                }
                newReplyCommentArr.push(replyComment)
            }
            dataReturn.errCode = 0
            dataReturn.message = `OK. Child comment of parentCommentId: ${parentCommentId}`
            dataReturn.replyComment = newReplyCommentArr
            resolve(dataReturn)
        } catch (error) {
            reject(error)
        }
    })
}

let getReplyChildComment = (replyCommentId) => {
    return new Promise(async (resolve, reject) => {
        try { 
            let dataReturn = {}
            let replyChildCommentArr = await db.ReplyChildComment.findAll({ where: { replyCommentId: replyCommentId } })
            let newReplyChildCommentArr = []
            for (const replyChildComment of replyChildCommentArr) {
                const user = await db.UserInfo.findOne({ where: { userId: replyChildComment.userId }})
                replyChildComment = {
                    userFullName: `${user.firstName+" "+user.lastName}`,
                    userAvatar: user.avatar,
                    ...replyChildComment
                }
                newReplyChildCommentArr.push(replyChildComment)
            }
            dataReturn.errCode = 0
            dataReturn.message = `OK. Reply child comment of replyCommentId: ${replyCommentId}`
            dataReturn.replyChildComment = newReplyChildCommentArr
            resolve(dataReturn)
        } catch (error) {
            reject(error)
        }
    })
}

let updateComment = (action, payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReturn = {}
            switch (action) {
                case 'update_like':
                    const parentCommentId = payload.parentCommentId
                    const replyCommentId = payload.replyCommentId
                    const replyChildCommentId = payload.replyChildCommentId
                    const userId = payload.userId
                    if (parentCommentId) {
                        const parentComment = await db.ParentComment.findOne({ where: { id: parentCommentId }})
                        if (parentComment) {
                            dataReturn.errCode = 0
                            let previousLike = parentComment.like ? JSON.parse(parentComment.like) : null
                            if (!previousLike) {
                                const newLike = [ userId ]
                                await db.ParentComment.update({ like: JSON.stringify(newLike)},{ where: { id: parentCommentId }})
                                dataReturn.message = `Added user: ${userId} to like list parent comment.`
                            } else {
                                if (previousLike.includes(userId)) {
                                    const deleteIndex = previousLike.indexOf(userId)
                                    previousLike.splice(deleteIndex, 1)
                                    await db.ParentComment.update({ like: JSON.stringify(previousLike)},{ where: { id: parentCommentId }})
                                    dataReturn.message = `Removed user: ${userId} to like list parent comment.`
                                } else {
                                    const newLike = [ ...previousLike, userId ]
                                    await db.ParentComment.update({ like: JSON.stringify(newLike)},{ where: { id: parentCommentId }})
                                    dataReturn.message = `Added user: ${userId} to like list parent comment.`
                                }
                            }
                        }
                    }
                    if (replyCommentId) {
                        const replyComment = await db.ReplyComment.findOne({ where: { id: replyCommentId }})
                        if (replyComment) {
                            dataReturn.errCode = 0
                            let previousLike = replyComment.like ? JSON.parse(replyComment.like) : null
                            if (!previousLike) {
                                const newLike = [ userId ]
                                await db.ReplyComment.update({ like: JSON.stringify(newLike)},{ where: { id: replyCommentId }})
                                dataReturn.message = `Added user: ${userId} to like list reply comment.`
                            } else {
                                if (previousLike.includes(userId)) {
                                    const deleteIndex = previousLike.indexOf(userId)
                                    previousLike.splice(deleteIndex, 1)
                                    await db.ReplyComment.update({ like: JSON.stringify(previousLike)},{ where: { id: replyCommentId }})
                                    dataReturn.message = `Removed user: ${userId} to like list reply comment.`
                                } else {
                                    const newLike = [ ...previousLike, userId ]
                                    await db.ReplyComment.update({ like: JSON.stringify(newLike)},{ where: { id: replyCommentId }})
                                    dataReturn.message = `Added user: ${userId} to like list reply comment.`
                                }
                            }
                        }
                    }
                    if (replyChildCommentId) {
                        const replyChildComment = await db.ReplyChildComment.findOne({ where: { id: replyChildCommentId }})
                        if (replyChildComment) {
                            dataReturn.errCode = 0
                            let previousLike = replyChildComment.like ? JSON.parse(replyChildComment.like) : null
                            if (!previousLike) {
                                const newLike = [ userId ]
                                await db.ReplyChildComment.update({ like: JSON.stringify(newLike)},{ where: { id: replyChildCommentId }})
                                dataReturn.message = `Added user: ${userId} to like list parent comment.`
                            } else {
                                if (previousLike.includes(userId)) {
                                    const deleteIndex = previousLike.indexOf(userId)
                                    previousLike.splice(deleteIndex, 1)
                                    await db.ReplyChildComment.update({ like: JSON.stringify(previousLike)},{ where: { id: replyChildCommentId }})
                                    dataReturn.message = `Removed user: ${userId} to like list parent comment.`
                                } else {
                                    const newLike = [ ...previousLike, userId ]
                                    await db.ReplyChildComment.update({ like: JSON.stringify(newLike)},{ where: { id: replyChildCommentId }})
                                    dataReturn.message = `Added user: ${userId} to like list parent comment.`
                                }
                            }
                        }
                    }

                    break;
            
                default:
                    break;
            }
            resolve(dataReturn)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = 
{ 
    createParentComment, createReplyComment, createReplyChildComment,
    getParentComment, getReplyComment, getReplyChildComment, updateComment,
}