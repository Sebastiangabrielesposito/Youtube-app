import express from "express";
import {update,deleteUser,getUser,subscribe,unSubscribe,like,dislike, uploadProfileImage} from "../controllers/user.js"
import { verifyToken } from "../verifyToken.js";
import { upload } from "../controllers/multer.js";
import multer from "multer";


const router = express.Router()

//update user
router.put("/:id", verifyToken,update);

//delete user
router.delete("/:id", verifyToken,deleteUser);

//get a user
router.get("/find/:id", getUser)

//subscribe user
router.put("/sub/:id", verifyToken,subscribe)

//unSubscribe user
router.put("/unsub/:id", verifyToken,unSubscribe)

//like a video
router.put("/like/:videoId", verifyToken,like)


//dislike a video
router.put("/dislike/:videoId", verifyToken,dislike)

//Change image profile
router.post("/upload-profile-image/:id", upload.single('profileImage'), verifyToken, uploadProfileImage);

export default router