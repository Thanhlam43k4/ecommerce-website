
// const User = require("../models/user.model")
// const User = require("../model/User")

// Get me with jwt 
const getMe = async(req,res) =>{

  try{
    if(!req.user){
      return res.status(401).json({msg : "Unauthorized"});
    }
    const user = await User.findByEmail(req.user.email);

    if(!user) return res.status(404).json({msg : "User not found!!"});

    res.status(200).json(user);

  }catch(err){
    res.status(500).json({msg : "Sever error",error: err.message });
  }

}

// Get /api/users/:id - Lấy thông tin từ user khác 

const getUserById = async(req,res) =>{
  try{
    const userId = req.params.id;
    const user = await User.findById(userId);

    if(!user){
      return res.status(404).json({msg : "User not found!!"});
    }

    res.status(200).json(user);
  }catch(error){
    res.status(500).json({msg : "Server Error!!", error: error.message});
  }

}




module.exports = {getMe,getUserById};