const expressAsyncHandler = require("express-async-handler");
const restaurantModel = require("../../model/restaurant");
const isValidObjectId = require("../../utils/mongooseIdValidity");
const UserModel = require("../../model/user");
const sendBrevoEmail = require("../../utils/services/mailSender");






// register restaurant controller
const restaurantRegisterController = expressAsyncHandler(async (req, res) => {


    const { restaurantName,about, location, phone, userId } = req.body;
     // check if restaurant details are passed correctly
  if (!restaurantName || !about || !location || !phone || !req.file || !userId) {
    throw new Error("Missing credentials");
  }

  const isIdVallid = isValidObjectId(userId.toString())

if(!isIdVallid){
return res.status(404).json({
  status:"false",
  message:"Invalid UserId"
 })
}
    
    
const imageUrl = req?.file?.path.toString()
 

  // find if user already exist

   
  
    const foundRestaurantName = await restaurantModel.findOne({
   restaurantName
    })

    const foundRestaurantUserId = await restaurantModel.findOne({
        userId
         })

  if (foundRestaurantName ) {
    throw new Error("Restaurant name  already exists.");
  }
  if (foundRestaurantUserId ) {
    throw new Error("User already has a restaurant");
  }
    const registeredRestaurant = await restaurantModel.create({
        restaurantName, about, location, phone,
        gallery:imageUrl, userId
    })

    const { fullName, email} = await UserModel.findById(userId)
    const option = {
        subject: "Restaurant creation",
        emailTemplate:
          "Hello " + fullName + " your restaurant " + restaurantName + " has been created but still on pending approval by the admin" ,
        to: [
          {
            email: email,
            name: fullName,
          },
        ],
      };
    
      sendBrevoEmail(option);
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
    
console.log("id passed",id)
   
    const isIdVallid = isValidObjectId(id.toString())
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


const getUserRestaurantController = expressAsyncHandler(async (req, res) => {


    const { userId } = req.params;
     // check if restaurant details are passed correctly
  if (!userId) {
    throw new Error("Missing credentials");
  }

  const isIdVallid = isValidObjectId(userId.toString())

if(!isIdVallid){
return res.status(404).json({
  status:"false",
  message:"Invalid UserId"
 })
}

 

  // find if user already exist

   
    const foundRestaurant = await restaurantModel.find({
        userId
      });

  if (!foundRestaurant) {
    throw new Error("Restaurant does not exist for user");
  }
   
    
   
  return res.status(201).json({
    status: "success",
    message: "Restaurant retreived successfully",
    data: foundRestaurant
  });
});


module.exports = { restaurantRegisterController, getAllRestaurantController, getSingleRestaurantController,getUserRestaurantController  };
