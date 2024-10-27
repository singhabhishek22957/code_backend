import {v2 as cloudinary }  from 'cloudinary'    // v2 as cloudinary is only name we can also put v2
import fs from 'fs'

   // Configuration
   cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});


const uploadOnCloudinary=async(localFilePath)=>{
  try {
    if(!localFilePath) return null;
    // upload the file cloudinary 
    const response = await cloudinary.uploader.upload(localFilePath,{
      resource_type: 'auto',

    })

    // file has been uploaded successfully
    // console.log("file is uploaded on cloudinary:  ",response.url);
    fs.unlinkSync(localFilePath)
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath)  // remove the locally saved temporary file as the operation got failed
    return null;
    
  }
}


export {uploadOnCloudinary}