const express = require("express");
const multer = require('multer');

const { getSingleRestaurantController, getAllRestaurantController, restaurantRegisterController, getUserRestaurantController } = require("../../controllers/restaurant/restaurantController");


const storage = require('../../utils/fileUpload/storage');

// creating a multer upload middleware




const upload = multer({storage: storage})

const restaurantRouter = express.Router();

 restaurantRouter.post("/create", upload.single("file"), restaurantRegisterController); 
restaurantRouter.get("/getAllRestaurants", getAllRestaurantController); 
restaurantRouter.get("/userRestaurant/:userId", getUserRestaurantController); 
restaurantRouter.get("/:id", getSingleRestaurantController); 


module.exports = restaurantRouter;
