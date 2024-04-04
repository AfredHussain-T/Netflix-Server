require('dotenv').config();
const router = require('express').Router();
const SECRET_KEY = process.env.SECRET_KEY;
const { verify } = require('../config/jwtProvider');
const User = require('../models/User');

const CryptoJS = require('crypto-js');

// update user

router.put("/:id", verify, async (req, res)=>{
    if(req.user.id === req.params.id || req.user.isAdmin){
        if(req.body.password){
            req.body.password = CryptoJS.AES.encrypt(req.body.password, SECRET_KEY).toString();
        }
        try {
            const updateUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            },{new:true});
            const {password, ...user} = updateUser;
            return res.status(200).send({updateUser, message:"user updated"});
        } catch (error) {
            return res.status(500).send(error);
        }
    }else{
        return res.status(401).send("Unauthorized User");
    }
});

// delete user

router.delete("/:id", verify, async (req, res)=>{
    if(req.user.id === req.params.id ||req.user.isAdmin){
        try {
            await User.findByIdAndDelete(req.params.id);
            return res.status(200).send({message:"user no longer exists, deleted..."});
        } catch (error) {
            return res.status(500).send(error);
        }
    }else{
        return res.status(401).send("Unauthorized User To Delete");
    }
});

// get user

router.get("/find/:id", async (req, res)=>{
    
    try {
        const user = await User.findById(req.params.id);
        const {password, ...info} = user._doc;
        return res.status(200).send({info});
    } catch (error) {
        return res.status(500).send(error);
    }
    
});

// get all users

router.get("/", verify, async (req, res)=>{
    const query = req.query.new;
    if(req.user.isAdmin){
        try {
            const users = query ? await User.find().sort({_id:-1}).limit(10) : await User.find();
            return res.status(200).send({users});
        } catch (error) {
            return res.status(500).send(error);
        }
    }else{
        return res.status(401).send("Unauthorized User, not allowed to view all users");
    }
});

// Get User Stats


// get all users

router.get("/stats", async (req, res)=>{
    const today = new Date();
    const lastYear = today.setFullYear(today.setFullYear() - 1);

    const monthsArray = ["January", "February","March","April","May","June","July","August","September","October","November","December"];

    try {
        const data = await User.aggregate([
            {
                $project:{
                    month:{$month:"$createdAt"}
                }
            },{
                $group:{
                    _id:"$month",
                    total:{$sum:1}
                }
            }
        ]);

        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router;