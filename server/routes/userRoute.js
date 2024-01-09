const express = require('express');
const router = express.Router(); 

const multer = require('../middlewares/multer.middleware.js');
const userController = require('../controller/userController');

const { refreshtoken } = require('../middlewares/refreshToken.js');
const verifytoken = require('../middlewares/verifyToken.js');

router.post('/register', userController.register);
router.post('/login', userController.login);
// router.post('/logout', verifytoken,userController.logout);


router.get('/user', verifytoken, userController.getUser);
router.get('/refresh', refreshtoken, verifytoken, userController.getUser);

router.post('/upload-cloudinary', multer.single('profilePicture'), userController.uploadCloudinary);
router.post('/fetchUrl', userController.fetchUrl);

module.exports = router;
