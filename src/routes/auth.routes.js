const express = require('express');
const {register,login} = require("../controllers/authController");
const router = express.Router();



// Route register
router.post("/register",register);


// Route.login 

router.post("/login",login);


module.exports = router;


