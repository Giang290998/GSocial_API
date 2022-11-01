import express from 'express';
import userController from '../controllers/userController';
import postController from '../controllers/postController';
import tokenController from '../controllers/tokenController';
import commentController from '../controllers/commentController';
import chatController from '../controllers/chatController';
import notificationController from '../controllers/notificationController';
import redisClientController from '../controllers/redisClientController';
import { requireToken } from '../middlewares/requireToken';

let router = express.Router();

let initWebRoutes = (app) => {
    
    router.get('/api/user/login/remember/:token', userController.handleLoginWithRememberToken) 
    router.get('/api/user/login/third_party_information/:email', userController.handleLoginWithEmail) 
    router.get('/api/user/login/:id/:password', userController.handleLoginUser) 
    router.get('/api/user/profile/information/:id', userController.handleGetInfoProfileUser) 
    router.post('/api/user/create', userController.handleCreateUser)
    router.patch('/api/user/update', userController.handleUpdateUser)
    router.post('/api/notification/friend/request/create', userController.handleCreateFriendRequest)
    router.put('/api/notification/friend/request/delete', userController.handleDeleteFriendRequest)

    router.post('/api/post/create', postController.handleCreatePost) 
    router.post('/api/post/read/all/profile', postController.handleGetAllProfilePost) 
    router.post('/api/post/read/all/homepage', postController.handleGetAllPostHomePage) 
    router.patch('/api/post/update', postController.handleUpdatePost) 
    router.delete('/api/post/delete', postController.handleDeletePost) 

    router.post('/api/comment/create', commentController.handleCreateComment) 
    router.post('/api/comment/get', commentController.handleGetComment)
    router.post('/api/comment/update', commentController.handleUpdateComment)

    router.post('/api/chat/get/all/message', chatController.handleGetAllMessage)
    router.post('/api/chat/normal/create', chatController.handleCreateNormalChat)
    router.post('/api/message/create', chatController.handleCreateMessage)
    router.put('/api/message/modified', chatController.handleModifiedMessage)
    router.put('/api/messages/modified/status', chatController.handleModifiedStatusManyMessage) 
    router.put('/api/messages/modified/all/status', chatController.handleModifiedAllMessageStatus) 

    router.get('/api/notification/get/:userId', notificationController.handleGetNotification)

    router.get('/api/weather/get/:lat/:lon', redisClientController.handleGetWeatherInformation)

    router.post('/api/token/refresh', tokenController.handleRenewToken)

    router.get('/api/search/user/:stringSearch', userController.handleSearchUser)

    return app.use('/', requireToken, router); 

};

module.exports = initWebRoutes;
