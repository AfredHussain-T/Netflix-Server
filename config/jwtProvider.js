const jwt = require('jsonwebtoken');
require('dotenv').config();
module.exports.verify = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.SECRET_KEY, (err, user)=>{
            if(err){
                return res.status(401).send("Unauthorized Token/ Invalid Token");
            }
            req.user = user;
            next();
        })
    }else{
        return res.status(401).send("Token Not Found");
    }
}

