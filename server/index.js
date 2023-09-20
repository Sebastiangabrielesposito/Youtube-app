import express from 'express'
import { __dirname } from './utils.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import authRouter from './routes/auth.js'
import userRouter from './routes/users.js'
import videoRouter from './routes/video.js'
import commentsRouter from './routes/comments.js'
import cookieParser from 'cookie-parser';
import cors from "cors"

dotenv.config()

const app = express()
const url_mongo = process.env.URL_MONGO

mongoose.set("strictQuery", true);
try{
  await mongoose.connect(url_mongo)
  console.log('Conectado a la base de datos');
}catch (error){
    console.log("error");
}
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true,
}))

//Setting express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(__dirname + "/public"));
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/videos', videoRouter)
app.use('/api/comments', commentsRouter)

//setting error
app.use((err, req, res, next) =>{
  const status = err.status || 500;
  const message = err.message || "Smething went wrong!";
  return res.status(status).json({
    success:false,
    status,
    message
  })
})

app.listen(8080, ()=> {
    console.log('listening to port, 8080');
})