const express = require('express');
const router = express.Router(); 

const chatController = require('../controller/chatController');

router.post('/fetchother',chatController.fetchOther);

router.post('/getmsg',chatController.getmsg);
router.post('/addmsg',chatController.addmsg);


module.exports = router;
