const expressAsyncHandler = require("express-async-handler");

const isValidObjectId = require("../../utils/mongooseIdValidity");
const restaurantModel = require("../../model/restaurant");
const UserModel = require("../../model/user");
const sendBrevoEmail = require("../../utils/services/mailSender");






// register restaurant controller
const activateRestaurantAdminController = expressAsyncHandler(async (req, res) => {

  const { restaurantId } = req.params;

  // check if restaurant details are passed correctly
  if (!isValidObjectId(restaurantId.toString())) { 
    throw new error("Invalid restaurant Id")
       }

  // find if user already exist

    const restaurant = await restaurantModel.findById(restaurantId);
    const { restaurantStatus, userId,restaurantName } = restaurant
    
    const { fullName, email } = await UserModel.findById(userId)
    


    if (restaurantStatus === "approved") {
        res.status(200).json({
            status: "success",
            message: "Restaurant allready approved",
          });
    return 
    }

    restaurant.restaurantStatus = "approved"

    restaurant.save()
    
const option = {
    subject: "Restaurant Activation",
    emailTemplate:
      "Congratulations " + fullName + "your restaurant "+ restaurantName +" has been approved." ,
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
    message: "Restaurant approved successfully"
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



module.exports = { activateRestaurantAdminController };
