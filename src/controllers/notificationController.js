import notificationService from '../services/notificationService';

let handleGetNotification = async (req, res) => {
    const userId = req.params.userId

    let packageRes = await notificationService.getNotification(userId)

    res.json({ ...packageRes })

    packageRes.errCode === 0 ? res.status(200) : res.status(400)

    return res
}

module.exports = { 
    handleGetNotification,
}