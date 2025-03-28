const express = require('express');
const {getMe,getUserById,updateUserInfo} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authenticate');
const router =  express.Router();



// Route register
router.get("/me",getMe);


// Route.login 

router.get("/:id",getUserById);

router.post('/profile',updateUserInfo);




module.exports = router;

