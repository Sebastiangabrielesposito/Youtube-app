import mongoose from "mongoose"
import User from "../models/User.js"
import bcrypt from "bcrypt"
import {hashPassword, comparePasswords, generateToken} from "../utils.js"
import { createError } from "../error.js"
import cookieParser from "cookie-parser"
import jwt from 'jsonwebtoken';



export const signup = async(req,res,next) => {
    try {
        const hash = await hashPassword(req.body.password);  
        const newUser = new User({...req.body, password:hash, img: req.file ? req.file.filename : '', });

        await newUser.save()
        res.status(200).send("User has been created") 
    } catch (error) {
        console.log(error);
        next(error)
    }
}
  
export const signin = async (req, res, next) => {
    try {
        const { name } = req.body;
        const user = await User.findOne({ name: name });
        
        if (!user) return next(createError(404, "User not found"));

        const compare = await comparePasswords(req.body.password, user.password);
        
        if (!compare) return next(createError(400, "Wrong credentials"));

        const token = generateToken(user);
        const {password, ...others} = user._doc;
        
        res.cookie("access_token", token).status(200).json(others);
        
    } catch (error) {
        console.log(error);
        next(error);
    }
};
 
export const googleAuth = async(req,res,next) => {
    try {
        const user = await User.findOne({email:req.body.email});
        if(user){
            const token = generateToken(user);
            return res.cookie("access_token", token, { httpOnly: true }).status(200).json(user._doc);
        }else{
            const newUser = new User({
                ...req.body,
                fromGoogle:true,
                img: req.file ? req.file.filename : '',                       
            })
            const savedUser = await newUser.save();
            const token = generateToken(user);
            return res.cookie("access_token", token, { httpOnly: true }).status(200).json(savedUser._doc);
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
}

export const logout = async(req,res)=> {
    res.clearCookie("access_token");
    res.status(200).send("Sesión cerrada exitosamente");
}