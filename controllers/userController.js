const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModels');
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail")
const crypto = require('crypto');
// const cloudinary=require('cloudinary');


exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //   folder: "avatarsNotes",
    //   width: 150,
    //   crop: "scale",
    // });
  
    const { name, email, password,confirmPassword } = req.body;
  
    if(password===confirmPassword){
    const user = await User.create({
      name,
      email,
      password,
    //   avatar: {
    //     public_id: myCloud.public_id,
    //     url: myCloud.secure_url,
    //   },
    });
    sendToken(user, 201, res);
    } else{
        return res.status(400).json({
            success:false,
            msg:"Passwords don't match"
        })
    } 
  });

//LOGIN USER:

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Email or Password Missing", 400));
    }

    const user = await User.findOne({ email: email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    // const token=user.getJWTTOKEN();
    sendToken(user, 200, res);


    // res.status(200).json({
    //     success:true,
    //     token
    // });

})


//LOGOUT USER:
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null), {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite:process.env.NODE_ENV==="Development"?"lax":"none",
        secure:process.env.NODE_ENV==="Development"?false:true
    }

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
})


//Forgot PASSWORD:
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }


    //Get RESETPASSWORDTOKEN:
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset Token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email, then please ignore it`;

    try {

        await sendEmail({
            email: user.email,
            subject: `GymApp password Recovery`,
            message
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully.`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
})
// exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
//     const user = await User.findOne({ email: req.body.email });
  
//     if (!user) {
//       return next(new ErrorHander("User not found", 404));
//     }
  
//     // Get ResetPassword Token
//     const resetToken = user.getResetPasswordToken();
  
//     await user.save({ validateBeforeSave: false });
  
//     const resetPasswordUrl = `${req.protocol}://${req.get(
//       "host"
//     )}/password/reset/${resetToken}`;
  
//     const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  
//     try {
//       await sendEmail({
//         email: user.email,
//         subject: `Ecommerce Password Recovery`,
//         message,
//       });
  
//       res.status(200).json({
//         success: true,
//         message: `Email sent to ${user.email} successfully`,
//       });
//     } catch (error) {
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpire = undefined;
  
//       await user.save({ validateBeforeSave: false });
  
//       return next(new ErrorHander(error.message, 500));
//     }
//   });

//RESET PASSWORD

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
        return next(new ErrorHandler("Reset Password token is invalid or has been expired", 400));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user,200,res);
})

exports.getUserDetails=catchAsyncErrors(async (req,res,next)=>{
    const user=await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    });
});


//UPDATE PASSWORD
exports.updatePassword=catchAsyncErrors(async (req,res,next)=>{
    const user=await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }
    
    if(req.body.newPassword!==req.body.confirmPassword){
        return next(new ErrorHandler("Passwords do not match", 400));
    }

    user.password=req.body.newPassword;

    await user.save();

    sendToken(user,200,res);
});



//UPDATE user profile
exports.updateProfile=catchAsyncErrors(async (req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email
    }

    // if(req.body.avatar!==""){
    //     const user=await User.findById(req.user.id);
    //     const imageId=user.avatar.public_id;
        // await cloudinary.v2.uploader.destroy(imageId);
        // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        //     folder: "avatarsNotes",
        //     width: 150,
        //     crop: "scale",
        //   });
          
        // newUserData.avatar={
        //     public_id:myCloud.public_id,
        //     url:myCloud.secure_url
        // }
    // }

    const user= await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true
    })
});


//GET ALL USERS-admin:
// exports.getAllUser=catchAsyncErrors(async (req,res,next)=>{
//     const users=await User.find();
//     res.status(200).json({
//         success:true,
//         users
//     })
// })
// //GET single USER-admin:
// exports.getSingleUser=catchAsyncErrors(async (req,res,next)=>{
//     const user=await User.findById(req.params.id);

//     if(!user){
//         return next(new ErrorHandler(`User does not exist for if: ${req.params.id}`,400))
//     };

//     res.status(200).json({
//         success:true,
//         user
//     })
// })



// //UPDATE user role--admin:
// exports.updateRole=catchAsyncErrors(async (req,res,next)=>{
//     // const newUserData={
//     //     name:req.body.name,
//     //     email:req.body.email,
//     //     role:req.body.role
//     // }

//     // let user=User.findById(req.params.is);

//     //  user= await User.findByIdAndUpdate(req.user.id,newUserData,{
//     //     new:true,
//     //     runValidators:true,
//     //     useFindAndModify:false
//     // })

//     // if(!user){
//     //     return next(new ErrorHandler(`User does not exist with idL $req.params.id`,400));
//     // }

//     // res.status(200).json({
//     //     success:true
//     // })
//     const newUserData = {
//         name: req.body.name,
//         email: req.body.email,
//         role: req.body.role,
//       };
    
//       await User.findByIdAndUpdate(req.params.id, newUserData, {
//         new: true,
//         runValidators: true,
//         useFindAndModify: false,
//       });
    
//       res.status(200).json({
//         success: true,
//       });
// });



// //DELETE user--admin:
// exports.deleteUser=catchAsyncErrors(async (req,res,next)=>{

//     const user= await User.findById(req.params.id)

//     if(!user){
//         return next(new ErrorHandler(`User does not exist with idL $req.params.id`,400));
//     }

//     const imageId=user.avatar.public_id;

//     await cloudinary.v2.uploader.destroy(imageId);

//     await user.deleteOne();

//     res.status(200).json({
//         success:true,
//         message:"User Deleted Successfully"
//     })
// });