const express = require("express");
const { activateRestaurantAdminController, deleteUserAdminController, activateReviewAdminController } = require("../../controllers/admin/adminController");





const adminRouter = express.Router();

adminRouter.get("/activateRestaurant/:restaurantId", activateRestaurantAdminController); 
adminRouter.get("/activateRestaurant/:restaurantId", activateRestaurantAdminController); 

 /* activate review controller */

adminRouter.post("/review/approve", activateReviewAdminController); 
adminRouter.delete("/deleteUser/:userId", deleteUserAdminController); 

module.exports = adminRouter;
