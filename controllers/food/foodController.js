const expressAsyncHandler = require("express-async-handler");
const restaurantModel = require("../../model/restaurant");
const isValidObjectId = require("../../utils/mongooseIdValidity");
const foodModel = require("../../model/food");






// add food to restaurant controller
const addFoodController = expressAsyncHandler(async (req, res) => {
 const imageUrl = req.file

  const { restaurantId,foodName, foodDescription, price,category } = req.body;
  
  // check if restaurant details are passed correctly
  if (!restaurantId || !foodName || !foodDescription || !price || !imageUrl || !category) {
    throw new Error("Missing credentials");
  }

  // find if user already exist

  const foundRestaurant = await restaurantModel.findOne({ restaurantId });

  if (!foundRestaurant) {
    throw new Error("Restaurant name does not exists");
  }
    
    const newFood = await foodModel.create({
        restaurantId,foodName, foodDescription, price, image: imageUrl, category
    })

  return res.status(201).json({
    status: "success",
    message: "Food added successfully",
    data: newFood
  });
});



const getAllRestaurantController= expressAsyncHandler(async(req,res) => {
  try {

    const restaurants = await restaurantModel.find()
    return res.status(200).json({
      status:"success",
      restaurants 
    })
    
  } catch (error) {
    throw new Error(error) 
  }
})
const getSingleRestaurantController = expressAsyncHandler(async(req, res) => {
    const { id } = req.params
   
    const isIdVallid = isValidObjectId(id)
    console.log("id passed", id, isIdVallid)
 if(!id || !isIdVallid){
  return res.status(404).json({
    status:"false",
    message:"Invalid Id"
   })
 }

 const restaurantFound = await restaurantModel.findById(id)
 if(!restaurantFound){
     return res.status(404).json({
      status:"false",
      message:"restaurant not found"
     })
 }

 return res.status(200).json({
  status:"success", 
  user: restaurantFound
 })
})



module.exports = { restaurantRegisterController, getAllRestaurantController, getSingleRestaurantController };
