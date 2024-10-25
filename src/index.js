// require('dotenv').config({path:'./env'})
import dotenv from 'dotenv'

import mongoose from "mongoose";
import express from 'express';
// import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
const app = express();

dotenv.config({
  path:'./env'
})



connectDB();










/*
;(async()=>{
  try {
    await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`)
    app.on("error",(error)=>{
      console.log("Error",error);
      throw error
      
    })

    app.listen(process.env.PORT,()=>{
      console.log(`App is running on ${process.env.PORT}`);
      
    })
    
  } catch (error) {
    console.log("Error: ",error);
    
    
    
  }
})()

*/