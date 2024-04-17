var jwt = require('jsonwebtoken');

const requireSingin = (req, res, next) => {
    
    const authHeader =  req.headers.Authorization || req.headers.authorization;
    if(authHeader){
        console.log(req.headers.Authorization)
        const token = authHeader.split(' ')[1];
        jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            if(err){
                return res.status(403).send("token error!")
            }
            console.log(user)
            req.user = user;
            next();
        });
    }else{
        return res.status(401).send("Token missing");
    }
}

module.exports = { requireSingin };