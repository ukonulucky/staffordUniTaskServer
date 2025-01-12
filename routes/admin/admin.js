const express = require("express");
const { activateRestaurantAdminController, deleteUserAdminController } = require("../../controllers/admin/adminController");





const adminRouter = express.Router();

adminRouter.get("/activateRestaurant/:restaurantId", activateRestaurantAdminController); 
 
adminRouter.delete("/deleteUser/:userId", deleteUserAdminController); 

module.exports = adminRouter;
