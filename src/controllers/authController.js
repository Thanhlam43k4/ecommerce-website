const bcrypt  = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model")
require("dotenv").config();


const SECRET_KEY = process.env.SECRET_KEY;

//Register user

const register = async(req,res) =>{
  try{
    const {name,email,password,role} = req.body;

    // check email is exsisted
    const existingUser = await User.findByEmail(email);
    
    if(existingUser) return res.status(400).json({message:"Email is existed!! Please login"});


    // Hash password 

    const hashedPassword = await bcrypt.hash(password,10);

    // Create User
    const userId = await User.create({name,email,password: hashedPassword, role});
    
    res.status(201).json({ message: "Register Successfully!!", userId});

  }catch (error){
    res.status(500).json({message : "Error From server!!",error});

  }
};

const login = async(req,res) =>{
  try{
    const {email,password} = req.body;

    // Find user with email
    const user = await User.findByEmail(email);
    if(!user) return res.status(400).json({message: "User isn't existed"})


    // Compare password
    const isMatch = await bcrypt.compare(password,user.password);

    if (!isMatch) return res.status(400).json({ message: "Email or password is wrong!!Please check again"});
    
    const token = jwt.sign({userId: user.id, role: user.role}, SECRET_KEY,{expiresIn: "1h"});

  } catch(err){
    res.status(500).json({message: "Error from server!!",err});
  }
};


module.exports = {register, login};