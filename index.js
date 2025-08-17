import dotenv from "dotenv"
import express from "express"
import connectDB from "./config/dbConnect.js"
import  cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "../backend/router/auth.router.js"

dotenv.config()
const app =express();
const port=process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/api/auth",authRouter);

app.listen(port,(req,res)=>{
    connectDB();
    console.log(`server started at http://localhost:${port}`);
})  