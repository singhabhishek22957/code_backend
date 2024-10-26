import mongoose from "mongoose";
import {DB_NAME}  from "../constants.js";



const connectDB=async ()=>{

  try {

    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URL}${DB_NAME}`,
      connectionOptions
    );
    console.log(`\n MongoDb connected !! DB  HOST: ${connectionInstance.connection.host}`);
    

    
  } catch (error) {

    console.log("Error: ",error);
    process.exit(1);
    
    
  }

}


export default connectDB
