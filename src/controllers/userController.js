
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

const updateUserInfo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, phone, address, city, postalCode } = req.body;

    if (!username && !phone && !address && !city && !postalCode) {
      return res.status(400).json({ msg: "No fields to update" });
    }

    const updatedUser = await User.updateUser(userId, {
      username,
      phone,
      address,
      city,
      postalCode,
    });

    if (updatedUser.affectedRows === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ msg: "User updated successfully" });

  } catch (error) {
    res.status(500).json({ msg: "Server Error!!", error: error.message });
  }
};

module.exports = {getMe,getUserById,updateUserInfo};