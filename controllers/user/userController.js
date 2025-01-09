const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt =require("jsonwebtoken");
const isValidObjectId = require("../../utils/mongooseIdValidity");
const UserModel = require("../../model/user");
const sendEmail = require("../../utils/services/sendEmail");
const mailSender = require("../../utils/services/mailing");
const sendBrevoEmail = require("../../utils/services/mailSender");






// register user controller
const userRegisterController = expressAsyncHandler(async (req, res) => {

  const { email, password, fullName, role} = req.body;

  // check if email and password are sent
  if (!email || !password) {
    throw new Error("Missing credentials");
  }

  // find if user already exist

  const foundUser = await UserModel.findOne({ email });

  if (foundUser) {
    throw new Error("User already exists");
  }


    const registeredUser = await UserModel.create({
         password, email, fullName, role
    })


    const { email: createdEmail } = registeredUser
    /* endpoint to verify email */
    const emailVerificationToken = registeredUser.createEmailVerificationToken()
     const verifyEmailEndpoint = process.env.SERVER_URL + "/api/v1/user" + "/emailVerify/" + createdEmail + "/"+ emailVerificationToken 
    const message = "Please click here " + verifyEmailEndpoint + " to verify your email"
    /* 
       const { subject,to, emailTemplate} = options; 
    */
    
   
  
  await registeredUser.save()
    /* send email for verification */
   /*  const option2 = {
        subject: "Account creation",
        emailTemplate: "Thank You " + createdEmail + "for sigining up, an email verifcation mail will be sent shortly" ,
        to: [{
            email: createdEmail,
            name:fullName
        }]
    } */


 /*    sendBrevoEmail(option2) */
    const option = {
        subject: "Email Verification",
        emailTemplate:"Please click here " + verifyEmailEndpoint + " to verify your email",
        to:[{
            email: createdEmail,
            name:fullName
        }]
    }

    sendBrevoEmail(option)
   
/* 
mailSender(message,createdEmail,"Registration")
 */

  return res.status(201).json({
    status: "success",
    message: "Please verify your email",
      data: registeredUser,
    meta: message
  });
});

/* verify user email */

const verifyEmailController = expressAsyncHandler(async(req, res) => { 
    const { email, token } = req.params
    console.log(req.params)
    
    if (!token || !email) { 
      throw new Error("Missing credentials")
    }

    const foundUser = await UserModel.findOne({
        email
    })
    if (!foundUser) {
        return res.status(401).json({
          status:false,
            message: "user not found"
        })
      }
    foundUser.isEmailVerified = true
    foundUser.accountVerificationToken = null
    await foundUser.save()
  const url = process.env.CLIENT_URL + "/emailVerified"
    res.redirect(process.env.CLIENT_URL)

})

const userLoginController = expressAsyncHandler(async(req,res, next) => {
    /* find user  */
    const { email, password } = req.body
   // check if email and password are sent
   if (!email || !password) {
    throw new Error("Missing credentials");
   }
    
    const user = await UserModel.findOne({
        email
    })

    const isPasswordCorrect = await user.comparePassword(password)
    
  
    if (!user || !isPasswordCorrect) { 
        throw new Error("Invalid login credential");
    }
    const { _id } = user
// set jwt token for the user
const token = jwt.sign({id:_id}, process.env.JWT_SECRET)

// set cookie

res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000,    // cookie will expire in 24 hours
    httpOnly: true,
    sameSite:"strict",
    secure:false

})

return res.status(200).json({
    status: "success",
    message:"Login successful",
    userName:user?.email
})


  
})


const userAuthticateController = expressAsyncHandler(async(req, res) => {
  try {
// console.log(req)
    const  {token} = req.cookies
    if(!token){
    return res.status(200).json({
      isAuthenticated: false
    })
    }
    const {id}  = jwt.verify(token, process.env.JWT_SECRET)
    const foundUser = await UserModel.findById(id)
    if (!foundUser) {
      return res.status(401).json({
        isAuthenticated: false
      })
    }
    return res.status(200).json({
      isAuthenticated: true,
      userName: foundUser.userName, 
      id:foundUser._id
    })
    
  } catch (error) {
    return res.status(401).json({
      isAuthenticated: false
    })
  }


})

const getAllUsersController= expressAsyncHandler(async(req,res) => {
    try {

    
    const users = await UserModel.find()
    return res.status(201).json({
      status:"success",
      users
    })
    
  } catch (error) {
    throw new Error(error) 
  }
})

const getSingleUserController = expressAsyncHandler(async(req, res) => {
const { id }= req.params
const isIdVallid = isValidObjectId(id)
 if(!id || !isIdVallid){
  return res.status(404).json({
    status:"false",
    message:"Invaild tid not found"
   })
 }

 const userFound = await UserModel.findById(id)
 if(!userFound){
     return res.status(404).json({
      status:"false",
      message:"User not found"
     })
 }

 return res.status(200).json({
  status:"success", 
  user: userFound
 })
})

const logOutUserController=  expressAsyncHandler(async(req, res) => {
         res.cookie("token", "", {
          maxAge: 1
         })
         return res.status(200).json({
             isAuthenticated: false,
             message: "user logged out"
         })
})


/* forgot password */

const forgotPasswordController = expressAsyncHandler(async(req, res) => { 
   
    const { email } = req.body
    if (!email) { 
      throw new Error("Missing credentials")
    }

  
    const foundUser = await UserModel.findOne({
        email
    })
    if (!foundUser) {
        return res.status(401).json({
           status: false,
            message: "user not found"
        })
      }
     
    /* generate 5 digit code */

   const code  = foundUser.createPasswordResetCode()
   
    
     await foundUser.save()
const message = "Please use this OTP " + code + " to change password. OTP expires in one hour" 
   /*  mailSender() */
    res.status(200).json({
        error: false,
        message: "OTP code sent to your mail", 
        meta: message
    })



})


const changePasswordController = expressAsyncHandler(async(req, res) => { 
   
    const { email, token , password} = req.body
    if (!email || !token || !password) { 
      throw new Error("Missing credentials")
    }

  
    const foundUser = await UserModel.findOne({
        email
    })
    if (!foundUser) {
        return res.status(401).json({
           status: false,
            message: "user not found"
        })
      }
     
    /* generate 5 digit code */

const isTokenValid =  foundUser.isPasswordResetTokenValid(token)
   
    if (!isTokenValid) { 
     return   res.status(200).json({
         error: false,
         status: false,
            message: "Incorrect or expired OTP", 
         
        })
    }
        


    
    foundUser.password = password
    foundUser.passwordResetExpires = null
    foundUser.passwordResetToken = null
    
    await foundUser.save()

    res.status(200).json({
        error: false,
        status: true,
        message: "Password updated successfully", 
     
    })
})




const deleteUserController = expressAsyncHandler(async (req, res) => {

    const {id} = req.params;
  
    // check if email and password are sent
    if (!id) {
      throw new Error("Missing credentials");
    }
  
    // find user
  
    const foundUser = await UserModel.findById(id);
  
    if (foundUser) {
      throw new Error("User already exists");
    }
  
  
      const registeredUser = await UserModel.create({
           password, email, fullName, role
      })
  
  
      const { email: createdEmail } = registeredUser
      /* endpoint to verify email */
      const emailVerificationToken = registeredUser.createEmailVerificationToken()
       const verifyEmailEndpoint = process.env.CLIENT_URL + "emailVerify/?" + "user" + emailVerificationToken 
      const message = "Please click here " + verifyEmailEndpoint + " to verify your email"
      /* 
         const { subject,to, emailTemplate} = options; 
      */
      
     
    
    await registeredUser.save()
      /* send email for verification */
     /*  const option2 = {
          subject: "Account creation",
          emailTemplate: "Thank You " + createdEmail + "for sigining up, an email verifcation mail will be sent shortly" ,
          to: [{
              email: createdEmail,
              name:fullName
          }]
      } */
  
  
   /*    sendBrevoEmail(option2) */
      const option = {
          subject: "Email Verification",
          emailTemplate:"Please click here " + verifyEmailEndpoint + " to verify your email",
          to:[{
              email: createdEmail,
              name:fullName
          }]
      }
  
      sendBrevoEmail(option)
     
  /* 
  mailSender(message,createdEmail,"Registration")
   */
  
    return res.status(201).json({
      status: "success",
      message: "Please verify your email",
        data: registeredUser,
      meta: message
    });
  });


module.exports = { userRegisterController, userLoginController, userAuthticateController, getAllUsersController, getSingleUserController, logOutUserController, verifyEmailController, forgotPasswordController, changePasswordController };
