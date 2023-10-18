import express from "express";
import {signup, signin, googleAuth, logout} from "../controllers/auth.js"
import { upload } from "../controllers/multer.js";
import multer from "multer";

const router = express.Router()

//Create user
router.post('/signup',  upload.single('img'), signup);
//Signup
router.post('/signin', signin);

//Google
router.post('/google', googleAuth);

//logout
router.post("/logout", logout);

export default router