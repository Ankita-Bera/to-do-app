const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req,res)=>{

    const {name,email,password} = req.body;

    try{

        const existing = await User.findOne({email});
        if(existing){
            return res.json({success:false,message:"User already exists"});
        }

        const hashed = await bcrypt.hash(password,10);

        const user = new User({
            name,
            email,
            password:hashed
        });

        await user.save();

        res.json({success:true});

    }catch(err){
        res.status(500).json({message:"Server error"});
    }

});


router.post("/login", async (req,res)=>{

    const {email,password} = req.body;

    try{

        const user = await User.findOne({email});

        if(!user){
            return res.json({success:false,message:"User not found"});
        }

        const match = await bcrypt.compare(password,user.password);

        if(!match){
            return res.json({success:false,message:"Wrong password"});
        }

        res.json({
            success:true,
            userId:user._id
        });

    }catch(err){
        res.status(500).json({message:"Server error"});
    }

});

module.exports = router;