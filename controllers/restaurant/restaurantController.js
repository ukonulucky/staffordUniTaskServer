const expressAsyncHandler = require("express-async-handler");
const restaurantModel = require("../../model/restaurant");
const isValidObjectId = require("../../utils/mongooseIdValidity");






// register restaurant controller
const restaurantRegisterController = expressAsyncHandler(async (req, res) => {

const imageUrl = req?.file?.path.toString()
    console.log("file sent", req.body,req.file)
  const { restaurantName,about, location, phone } = req.body;
  
  // check if restaurant details are passed correctly
  if (!restaurantName || !about || !location || !phone) {
    throw new Error("Missing credentials");
  }

  // find if user already exist

  const foundRestaurant = await restaurantModel.findOne({ restaurantName });

  if (foundRestaurant) {
    throw new Error("Restaurant name already exists");
  }
    
    const registeredRestaurant = await restaurantModel.create({
        restaurantName, about, location, phone,
        gallery:imageUrl
    })

  return res.status(201).json({
    status: "success",
    message: "Restaurant registered successfully",
    data: registeredRestaurant,
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
