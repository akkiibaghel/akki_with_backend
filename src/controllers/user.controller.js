import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import {User} from '../models/user.model.js'
import { uploadOnCloudnty } from '../utils/cloudnary.js';
import { ApiResponce } from '../utils/ApiResponce.js';

const generateAccessAndRefreshToken = async (userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken , refreshToken}
          
        // user.accessToken = accessToken
    } catch (error) {
        throw new ApiError(500, "Something wentwhile generateing the refresh and access token ")
    }
}


const registerUser = asyncHandler( async(req, res) =>{
    
    /*
    get user datils from frontend
    // validation -- not empty
    check if user already register : username , email
    check avatar and coverImage 
    upload them to cloudnity
    check avatar on cloudniry 
    create user object -- create enrty in db 
    remove refresh token and password field from responce 
    check for user creation
    retun res
    */

    const {fullName , username , email, password} = req.body
    // console.log(req.body)
    // console.log("Email: ", email , "fullName: ", fullName);
    if([fullName, email, password, username].some((field)=> field?.trim() =="")
    ){
        throw new ApiError(400, "All field is required")
    }
    const existUser = await User.findOne({
        $or: [{username} , {email}]
    })

    if (existUser) {
        throw new ApiError(409, "User already exist")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path
    // console.log(avatarLocalPath);

    // const coverLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    // console.log(coverLocalPath);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avarat image is required")
    }

    const avatar = await uploadOnCloudnty(avatarLocalPath)
    const coverImage = await uploadOnCloudnty(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, " Avatar is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()


    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering user")
    }
    return res.status(201).json(
        new ApiResponce(201, createdUser , "User registered Successfully ")
    )

})

const loginUser = asyncHandler( async(req , res) =>{
    /*
    req body se data 
    username and email 
    find the username and email 
    password check
    access and refreshToken 
    send cookie
    */
   const {email , username , password} = req.body
   console.log(email);

   if (!email) {
    throw new ApiError(400, "Username or password is required")
   }

   const user = await User.findOne({
    $or: [{username} , {email}]
   })

   if (!user) {
    throw new ApiError(404, "User not exist")
   }

   const isPasswordValid = await user.isPasswordCorrect(password)
   if (!isPasswordValid) {
    throw new ApiError(401, "password is not currect")
   }

   const {accessToken , refreshToken } = await generateAccessAndRefreshToken(user._id)
   const loggedInUser = User.findById(user._id).select("-password -refreshToken")

   const options = {
    httpOnly: true,
    secure: true
   }

   return res.status(200)
   .cookie("accessToken" ,accessToken , options)
   .cookie("refreshToken", refreshToken , options)
   .json(
    new ApiResponce(
        200,
        {
            user: loggedInUser, accessToken, refreshToken
        },
        "User login Successfully"
    )
   )
})

const logoutUser = asyncHandler(async (req, res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },

        {
           new: true
         }
    ) 

    const options = {
        httpOnly: true,
        secure: true
       }
       return res
       .status(200)
       .clearCookie("accessToken", options)
       .clearCookie("refreshToken", options)
       .json(new ApiResponce(200, {} , "User Log out "))
})

export { registerUser ,
    loginUser,
    logoutUser
}