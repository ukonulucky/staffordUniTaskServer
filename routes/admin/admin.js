const express = require("express");
const { activateRestaurantAdminController } = require("../../controllers/admin/adminController");





const adminRouter = express.Router();

 adminRouter.get("/activateRestaurant/:restaurantId", activateRestaurantAdminController); 

module.exports = adminRouter;
