import express from "express";
import {signup, signin, googleAuth, logout} from "../controllers/auth.js"


const router = express.Router()

//Create user
router.post('/signup', signup);
//Signup
router.post('/signin', signin);

//Google
router.post('/google', googleAuth);

//logout
router.post("/logout", logout);

export default router