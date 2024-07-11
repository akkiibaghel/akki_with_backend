import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import {User} from '../models/user.model.js'
import { uploadOnCloudnty } from '../utils/cloudnary.js';
import { ApiResponce } from '../utils/ApiResponce.js';


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
    console.log("Email: ", email , "fullName: ", fullName);
    if([fullName, email, password, username].some((field)=> field?.trim() =="")
    ){
        throw new ApiError(400, "All field is required")
    }
    const existUser = User.findOne({
        $or: [{username} , {email}]
    })

    if (existUser) {
        throw new ApiError(409, "User already exist")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path
    console.log(avatarLocalPath);

    const coverLocalPath = req. files.coverImage[0]?.path
    console.log(coverLocalPath);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avarat image is required")
    }

    const avatar = await uploadOnCloudnty(avatarLocalPath)
    const coverImage = await uploadOnCloudnty(coverLocalPath)

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

export { registerUser}