const express = require("express");
const multer = require('multer');



const storage = require('../../utils/fileUpload/storage');
const { addFoodController, getAllFoodController, getSingleFoodController } = require("../../controllers/food/foodController");

// creating a multer upload middleware




const upload = multer({storage: storage})

const foodRouter = express.Router();

 foodRouter.post("/create", upload.single("file"), addFoodController); 
foodRouter.get("/getAllFoods", getAllFoodController); 
foodRouter.get("/:id", getSingleFoodController); 


module.exports = foodRouter;
