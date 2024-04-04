require('dotenv').config();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

const SECRET_KEY = process.env.SECRET_KEY;

module.exports.registerUser = async (req, res) => {
    try {
        const newUser = await new User({
            username:req.body.username,
            email:req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, SECRET_KEY).toString(),
        });
    
        const user = await newUser.save();
        return res.status(200).send({user,message:"User created"});
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

module.exports.loginUser = async (req,res)=>{
    try {
        const user = await User.findOne({email:req.body.email});
        if(!user){
            return res.status(401).send({message:"user not found...!"});
        }
        const bytes  = CryptoJS.AES.decrypt(user.password, SECRET_KEY);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

        if(originalPassword !== req.body.password){
            return res.status(401).send({message:"Invalid username/password!"});
        }

        const token = jwt.sign({id:user._id, isAdmin:user.isAdmin}, SECRET_KEY, {expiresIn:"2d"});

        const {password, ...info} = user._doc;
        return res.status(200).send({...info, token, message:"authorized"});
    } catch (error) {
        return res.status(500).send(error.message);
    }
}