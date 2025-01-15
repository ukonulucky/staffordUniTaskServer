const expressAsyncHandler = require("express-async-handler");
const restaurantModel = require("../../model/restaurant");
const isValidObjectId = require("../../utils/mongooseIdValidity");
const foodModel = require("../../model/food");






// add food to restaurant controller
const addFoodController = expressAsyncHandler(async (req, res) => {
    // check if restaurant details are passed correctly

    const { restaurantId,foodName, foodDescription, price,category } = req.body;
  if (!restaurantId || !foodName || !foodDescription || !price || !category || !req.file) {
    throw new Error("Missing credentials");
  }


  const imageUrl = req.file.path
  
    if (!isValidObjectId(restaurantId)) { 
 throw new error("Invalid store")
    }

  // find if user already exist

  const foundRestaurant = await restaurantModel.findById( restaurantId );

  if (!foundRestaurant) {
    throw new Error("Restaurant name does not exists");
  }
    
    const newFood = await foodModel.create({
        restaurantId: foundRestaurant._id,foodName, foodDescription, price, image: imageUrl, category
    })

  return res.status(201).json({
    status: "success",
    message: "Food added successfully",
    data: newFood
  });
});

/* updated food */

const updateFoodController = expressAsyncHandler(async (req, res) => {
  // check if restaurant details are passed correctly

  const { foodName, foodDescription, price,category, foodId } = req.body;
if (!foodName || !foodDescription || !price || !category || !req.file || !foodId) {
  throw new Error("Missing credentials");
}

const isFoodIdVallid = isValidObjectId(foodId.toString());
  
if (!isFoodIdVallid) {
  throw new Error("Invaild user or restaurant Id")
 }
const imageUrl = req.file.path



 

const upDatedFood = await foodModel.findByIdAndUpdate(foodId,{
      foodName, foodDescription, price, image: imageUrl, category
  }, {
    new: true
  })


  if (!upDatedFood) { 
    throw new Error("Failed to update food")
  }

return res.status(201).json({
  status: "success",
  message: "Food updated successfully",
  data: newFood
});
});



const getAllFoodController = expressAsyncHandler(async(req,res) => {
  try {

    const  foods = await foodModel.find()
    return res.status(200).json({
      status:"success",
        error: false,
       foods
    })
    
  } catch (error) {
    throw new Error(error) 
  }
})
const getSingleFoodController = expressAsyncHandler(async(req, res) => {
    const { id } = req.params
   
    const isIdVallid = isValidObjectId(id.toString())
    console.log("id passed", id, isIdVallid)
 if(!id || !isIdVallid){
  return res.status(404).json({
    status:"false",
    message:"Invalid Id"
   })
 }

 const foodFound = await foodModel.findById(id)
 if(!foodFound){
     return res.status(404).json({
      status:"false",
      message:"food not found"
     })
 }

 return res.status(200).json({
  status:"success", 
  food: foodFound
 })
})



module.exports = { addFoodController, getAllFoodController, getSingleFoodController, updateFoodController};
