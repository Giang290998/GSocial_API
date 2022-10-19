import db from '../models/index'
import useService from '../services/userService'

let createNewPost = (id, textContent, imageContent, mode) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReturn = {}
            let userExist = await useService.checkUserExist(id)
            if (userExist) {
                await db.Post.create({ 
                    userId: id,
                    textContent: textContent, 
                    imageContent: imageContent, 
                    mode: mode,
                })

                dataReturn.errCode = 0
                dataReturn.message = "The request has been fulfilled, new post created !"
                resolve(dataReturn)
            } else {
                dataReturn.errCode = 1
                dataReturn.errMessage = "Wrong ID. User does not exist."
                resolve(dataReturn)
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllPostProfilePage = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReturn = {}
            let userExist = await useService.checkUserExist(id)        
            if (userExist) {
                let postsDB = await db.Post.findAll({ where: { userId: id }})
                let user = await db.UserInfo.findOne({ where: { userId: id }})
                let posts = postsDB.map(post => {
                    return {
                        avatar: user.avatar,  
                        firstName: user.firstName, 
                        lastName: user.lastName,
                        ...post,
                    }
                })
                dataReturn.errCode = 0
                dataReturn.message = "OK!"
                dataReturn = { ...dataReturn, posts }
                resolve(dataReturn)
            } else {
                dataReturn.errCode = 1
                dataReturn.errMessage = "Wrong ID. User does not exist."
                resolve(dataReturn)
            }    
        } catch (error) {
            reject(error)
        }
    })
}

let getAllPostHomePage = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let allPost = []
            let postFriendArr = []
            let allPostPublicModeArr = []
            let dataReturn = {}

            let userExist = await useService.checkUserExist(id)        
            if (userExist) {

                // Prioritize your friends' posts
                
                let user = await db.UserInfo.findOne({ where: { userId: id }})
                if (user.friend) {
                    let arrFriendId = user.friend.split(",")
                    for (const friendId of arrFriendId) {
                        let friendPostArr = await db.Post.findAll({ where: { userId: friendId }})
                        friendPostArr = friendPostArr.filter((friendPost) => {
                            return friendPost.mode !== 'private'
                        })
                        let friend = await db.UserInfo.findOne({ where: { userId: friendId }})
                        for (const postObject of friendPostArr) {
                            const newPostObject = { 
                                avatar: friend.avatar,  
                                firstName: friend.firstName, 
                                lastName: friend.lastName,
                                ...postObject
                            }
                            postFriendArr = [ ...postFriendArr, newPostObject ] 
                        }
                    }
                    postFriendArr.sort(function(a,b){
                        return new Date(b.createdAt) - new Date(a.createdAt)
                    })                    
                }

                // Other people's posts are set to public mode

                let allPostOtherArr = await db.Post.findAll({ where: { mode: "public"} })
                let allPostOtherModifiedArr = []
                for (const postObject of allPostOtherArr) {
                    let user = await db.UserInfo.findOne({ where: { userId: postObject.userId } })
                    let postObjectModified =  {
                        avatar: user.avatar,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        ...postObject
                    }
                    allPostOtherModifiedArr.push(postObjectModified)
                }
                allPostOtherModifiedArr.sort(function(a,b){
                    return new Date(b.createdAt) - new Date(a.createdAt)
                })
              
                if (user.friend) {
                    let arrFriendId = user.friend.split(",")
                    for (const postObject of allPostOtherArr) {
                        let user = await db.UserInfo.findOne({ where: { userId: postObject.userId }})
                        if (!arrFriendId.includes(postObject.userId)) {
                            const newPostObject = {
                                avatar: user.avatar,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                ...postObject
                            }
                            allPostPublicModeArr = [ ...allPostPublicModeArr, newPostObject]
                        }
                    }
                }
                allPostPublicModeArr.sort(function(a,b){
                    return new Date(b.createdAt) - new Date(a.createdAt)
                })

                allPost = user.friend ? [ ...postFriendArr, ...allPostPublicModeArr] : [ ...allPostOtherModifiedArr ]

                dataReturn.errCode = 0
                dataReturn.message = "OK!"
                dataReturn = { ...dataReturn, allPost }
                resolve(dataReturn)
            } else {
                dataReturn.errCode = 1
                dataReturn.errMessage = "Wrong ID. User does not exist."
                resolve(dataReturn)
            }    
        } catch (error) {
            reject(error)
        }
    })
}

let updatePost = (id, updateContent) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReturn = {}
            let post = await db.Post.findOne({ where: { id: id }})
            if (post) {
                dataReturn.errCode = 0
                for (const key in updateContent) {
                    switch (key) {
                        case "textContent":
                            let textContentUpdate = updateContent.textContent
                            await db.Post.update({ textContent: textContentUpdate }, { where: { id: id } })
                            dataReturn.messageUpdateTextContent = "Text content updated!"
                            break;

                        case "imageContent":
                            let imageContentUpdate = updateContent.imageContent
                            await db.Post.update({ imageContent: imageContentUpdate }, { where: { id: id } })
                            dataReturn.messageUpdateImageContent = "Image content updated!"
                            break;

                        case "like":
                            let likeUpdate = updateContent.like
                            let previousLike = post.like ? JSON.parse(post.like) : null
                            if (previousLike === null) {
                                let likeField = [ likeUpdate ]
                                await db.Post.update({ like: JSON.stringify(likeField) }, { where: { id: id } })
                                dataReturn.messageUpdateLike = `Added user: ${likeUpdate} to like list!`
                            } else {
                                if (previousLike.includes(likeUpdate)) {
                                    let deleteIndex = previousLike.indexOf(likeUpdate)
                                    previousLike.splice(deleteIndex, 1)
                                    await db.Post.update({ like: JSON.stringify(previousLike) }, { where: { id: id } })
                                    dataReturn.messageUpdateLike = `Removed user: ${likeUpdate} to like list!` 
                                } else {
                                    let likeAddOne = [ ...previousLike, likeUpdate ]
                                    await db.Post.update({ like: JSON.stringify(likeAddOne) }, { where: { id: id } })
                                    dataReturn.messageUpdateLike = `Added user: ${likeUpdate} to like list!`
                                }
                            } 
                            break;

                        case "mode":
                            let modeUpdate = updateContent.mode
                            await db.Post.update({ mode: modeUpdate }, { where: { id: id } })
                            dataReturn.messageUpdateMode = `Post mode changed to: ${modeUpdate}`
                            break;

                        default:
                            break;
                    }
                }
                resolve(dataReturn)
            } else {
                dataReturn.errCode = 1
                dataReturn.errMessage = "Wrong ID. Post does not exist."
                resolve(dataReturn)
            }
        } catch (error) {
            reject(error)
        }
    })
}

let deletePost = (id, createdAt) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReturn = {}
            let post = await db.Post.findOne({ where: { userId: id, createdAt: createdAt }})
            if (post) {
                await db.Post.destroy({ where: { userId: id, createdAt: createdAt }})
                dataReturn.errCode = 0
                dataReturn.message = "Delete post successfully!"
                resolve(dataReturn)
            } else {
                dataReturn.errCode = 1
                dataReturn.errMessage = "Can not find post, deletion request not fulfilled!"
            }
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = { 
    createNewPost, getAllPostProfilePage, getAllPostHomePage, updatePost, deletePost,

}