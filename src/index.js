// require('dotenv').config({path:'./env'})
import dotenv from 'dotenv';
import connectDB from "./db/index.js";
import { app } from './app.js';


dotenv.config({
  path:'./.env'
})



connectDB()
.then(()=>{
  app.on("error",(error)=>{
    console.log("Error",error);
    throw error
    
  })
  app.listen(process.env.PORT||8000,()=>{
    console.log(`server is running on port http://localhost:${process.env.PORT}`)
  })
})
.catch((error)=>{
  console.log("Mongo Db connection failed");
  
})










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