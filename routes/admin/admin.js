const express = require("express");
const { activateRestaurantAdminController, deleteUserAdminController, activateReviewAdminController, deleteReviewAdminController } = require("../../controllers/admin/adminController");





const adminRouter = express.Router();

adminRouter.get("/activateRestaurant/:restaurantId", activateRestaurantAdminController); 
adminRouter.get("/activateRestaurant/:restaurantId", activateRestaurantAdminController); 

 /* activate review controller */

adminRouter.post("/review/approve", activateReviewAdminController); 
adminRouter.delete("/review/deleteReview", deleteUserAdminController); 
adminRouter.delete("/deleteUser/:userId", deleteUserAdminController); 

deleteReviewAdminController 

module.exports = adminRouter;


/* /api/v1/admin/reveiw/approve */