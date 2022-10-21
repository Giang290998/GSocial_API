import notificationService from '../services/notificationService';

let handleGetNotification = async (req, res) => {
    try {
        const userId = req.params.userId

        let packageRes = await notificationService.getNotification(userId)
    
        res.json({ ...packageRes })
    
        packageRes.errCode === 0 ? res.status(200) : res.status(400)
    
        return res
    } catch (error) {
        console.log(error)   
    }
}

module.exports = { 
    handleGetNotification,
}