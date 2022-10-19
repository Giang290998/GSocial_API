import postService from '../services/postService'

let handleCreatePost = async (req, res) => {
    let { id, textContent, imageContent, mode } = req.body

    let packageRes = await postService.createNewPost(id, textContent, imageContent, mode)

    res.json({ ...packageRes })

    packageRes.errCode === 0 ? res.status(201) : res.status(406)

    return res
}

let handleGetAllProfilePost = async (req, res) => {
    let id = req.body.id

    let packageRes = await postService.getAllPostProfilePage(id)

    res.json({ ...packageRes })

    packageRes.errCode === 0 ? res.status(200) : res.status(400)

    return res
}

let handleGetAllPostHomePage = async (req, res) => {
    let id = req.body.id

    let packageRes = await postService.getAllPostHomePage(id)

    res.json({ ...packageRes })

    packageRes.errCode === 0 ? res.status(200) : res.status(400)

    return res
}

let handleUpdatePost = async (req, res) => {
    let {id, ...updateContent} =  req.body

    let packageRes = await postService.updatePost(id, updateContent)

    res.json({ ...packageRes })

    packageRes.errCode === 0 ? res.status(200) : res.status(400)

    return res    
}

let handleDeletePost = async (req, res) => {
    let { id, createdAt } = req.body

    let packageRes = await postService.deletePost(id, createdAt)

    res.json({ ...packageRes })

    packageRes.errCode === 0 ? res.status(200) : res.status(400)

    return res
}

module.exports = { handleCreatePost, handleGetAllProfilePost, handleGetAllPostHomePage, handleUpdatePost, handleDeletePost, }