const express = require('express');
const {getMe,getUserById} = require('../controllers/userController');
const router =  express.Router();



// Route register
router.get("/me",getMe);


// Route.login 

router.get("/:id",getUserById);


module.exports = router;

