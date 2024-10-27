
import {asyncHandler}  from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User}  from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async(userId)=>{
  try {
    const user = await User.findById(userId)
    // console.log(user);
    
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
     user.refreshToken = refreshToken
    await user.save({validateBeforeSave:false})
    return {accessToken , refreshToken}
    
  } catch (error) {
    throw new ApiError(500, "Something want wrong while generation refresh and access token" )

  }
}


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


const loginUser = asyncHandler(async (req,res)=>{
  // req body ->data
  // username or email
  // find the user 
  // check password
  // access and refresh token 
  // send cookie 


  // req body ->data
  const {email, username,password}=req.body;
  // console.log(email,username,password);
  
  // username or email
  if(!username|| !email){
    throw new ApiError(400,"Please enter either username or email")
  }
  // find the user 
  const user = await User.findOne({
    $or:[
      {
        username
      },
      {
        email
      }
    ]
  })
  if(!user){
    throw new ApiError(404,"User not found")
  }
  // check password
  if(!password){
    throw new ApiError(400,"Please enter password")
  }
  // const isValidPassword = await bcrypt.compare(password,user.password)
  const isPasswordValide = await user.isPasswordCorrect(password)

  if(!isPasswordValide){
    throw new  ApiError(404, "password incorrect")
  }

  // access and refresh token 

  const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-paasword -refreshToken")

  const options = {
    httpOnly:true,
    secure:true
  }
// send cookie

  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,accessToken,refreshToken
      },
      "User logged in successfully"
    )
  )

  
})

const logoutUser = asyncHandler(async(req,res)=>{
  User.findByIdAndUpdate(req.user._id,{$set:{refreshToken:undefined}},{ new:true })

  const options  ={
    httpOnly:true,
    secure:true
  }

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User Logged Out"))
  
})


const refreshAccessToken  = asyncHandler(async (req,res)=>{
  const incomingRefreshToken = req.cookies.refreshToken|| req.body.refreshToken
  if(!incomingRefreshToken){
    throw new ApiError("Unauthorized Request")
  }
  try {
    const decodedToken =  jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    if(!user){
      throw new ApiError("Invalid refresh token ")
    }
  
    if(incomingRefreshToken!==user?.refreshToken){
      throw new ApiError(" refresh token is expired or used ")  
    }
    const options = {httpOnly:true,secure:ture}
    const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id);
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json(
      new ApiResponse(200
        ,
        {accessToken,refreshToken:newRefreshToken},
        "Access Token Refreshed Successfully"
      )
    )
  } catch (error) {
    throw new ApiError(401,error?.message||"Invalid refresh token")
    
  }
})


export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
}
