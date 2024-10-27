
import {asyncHandler}  from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User}  from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const  registerUser = asyncHandler(async (req,res)=>{
  // res.status(200).json({
  //   message:"ok"
  // })
  

  // get user details form frontend 
  // validation --not empty 
  // check if user already exists 
  // check for Image , check for avatar 
  // upload then to cloudinary , avatar 
  // create user-object  -- create entry in db 
  // remove password and refresh token field from response 
  // check user creation 
  // return response 
  

  // get user details form frontend 

  const {fullName , username, email ,password } = req.body
  // console.log("email: ", email);

  // validation --not empty 

     // beginners do this like 
  // if(fullName===""){
  //   throw new ApiError(400,"Full Name is required")
  // }

  // exports 
  if(
    [fullName,email,username,password].some((field)=> field?.trim()==="")
  ){
    throw new ApiError(400,"All fields are required")
  }

  // check if user already exists 
  const existedUser = await User.findOne(
    {
      $or:[{username},{email}]
    }
  )

  if(existedUser){
    throw new ApiError(409,"User already exists")
  }

  // console.log(req.files);
  

  // check for Image , check for avatar 

  const avatarLocalPath = req.files?.avatar[0]?.path
  // const coverImageLocalPath =req.files?.coverImage[0]?.path

  let coverImageLocalPath;
  if(req.files&&Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
    coverImageLocalPath = req.files.coverImage[0].path
  }


  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required")
  }


  // upload then to cloudinary , avatar 

   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)


   if(!avatar){
    throw new ApiError(400,"Avatar upload failed")
   }
  
  // create user-object  -- create entry in db 
    const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url||"",
      email,
      username:username,
      password

     })

     const createdUser = await User.findById(user._id).select(
      "-password -refreshToken" 
     )

     if(!createdUser){
      throw new ApiError(500,"Something want wrong while user registration ")
     }

     return res.status(201).json(
      new ApiResponse(200,createdUser,"User register successfully ")
     )


  // remove password and refresh token field from response 
  // check user creation 
  // return response 



})




export {
  registerUser,
}