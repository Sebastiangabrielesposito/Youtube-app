import Jwt  from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req,res,next) => {
    const token = req.cookies.access_token
    if(!token) return next(createError(401, "You are not authenticated"))

    Jwt.verify(token, process.env.JWT, (err,user)=>{
        if(err) return next(createError(403, "Token is not valid!"))
        console.log('req.user:', user);
        req.user = user;
        next()
    })
}