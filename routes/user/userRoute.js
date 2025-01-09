const express = require('express');
const { userRegisterController, userLoginController, logOutUserController, userAuthticateController, getAllUsersController, getSingleUserController, verifyEmailController, forgotPasswordController, changePasswordController } = require('../../controllers/user/userController');


const userRouter = express.Router();


userRouter.post("/register", userRegisterController)
userRouter.post("/login", userLoginController)
userRouter.post("/forgotPassword", forgotPasswordController)
userRouter.post("/logout", logOutUserController)
userRouter.get("/emailVerify", verifyEmailController)
userRouter.post("/changePassword", changePasswordController)


userRouter.get("/authenticate", userAuthticateController)
userRouter.get("/allUsers", getAllUsersController)
userRouter.get("/:id", getSingleUserController)


module.exports = userRouter