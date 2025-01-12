const expressAsyncHandler = require("express-async-handler");

const isValidObjectId = require("../../utils/mongooseIdValidity");
const restaurantModel = require("../../model/restaurant");
const UserModel = require("../../model/user");
const sendBrevoEmail = require("../../utils/services/mailSender");
const ReviewModel = require("../../model/review");

// activate restaurant controller
const activateRestaurantAdminController = expressAsyncHandler(
  async (req, res) => {
    const { restaurantId } = req.params;

    // check if restaurant details are passed correctly
    if (!isValidObjectId(restaurantId.toString())) {
      throw new Error("Invalid restaurant Id");
    }

    // find if user already exist

        const restaurant = await restaurantModel.findById(restaurantId).populate("userId").exec();
        const { restaurantStatus, restaurantName, userId: { 
            fullName, email
        } } = restaurant;

  

    if (restaurantStatus === "approved") {
      res.status(200).json({
        status: "success",
        message: "Restaurant allready approved",
      });
      return;
    }

    restaurant.restaurantStatus = "approved";

    restaurant.save();

    const option = {
      subject: "Restaurant Approved",
      emailTemplate:
        "Congratulations " +
        fullName +
        " your restaurant " +
        restaurantName +
        " has been approved.",
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
      message: "Restaurant approved successfully",
    });
  }
);

// activate review controller
const activateReviewAdminController = expressAsyncHandler(
    async (req, res) => {
      const { reviewId } = req.body;
  
      // check if restaurant details are passed correctly
      if (!isValidObjectId(reviewId.toString())) {
        throw new Error("Invalid review Id");
      }

        const review = await ReviewModel.findById(reviewId).populate("userId").exec();
        

        console.log("review found", review)
        const { userId: { 
            fullName,
            email
        } } = review
        if (!review) { 
            throw new Error("Review not found")
        }

        if (review.reviewStatus === "approved") { 
          return  res.status(200).json({
                status: "success",
                message: "Review allready approved",
              });
        }
        review.reviewStatus = "approved"
        await review.save()
  
      const option = {
        subject: "Review Approved",
        emailTemplate:
          "Congratulations " +
          fullName +
          " your review has been approved.",
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
        message: "Review approved successfully",
      });
     
    }
  );



const getAllRestaurantController = expressAsyncHandler(async (req, res) => {
  try {
    const restaurants = await restaurantModel.find();
    return res.status(200).json({
      status: "success",
      restaurants,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const getSingleRestaurantController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  const isIdVallid = isValidObjectId(id);
  console.log("id passed", id, isIdVallid);
  if (!id || !isIdVallid) {
    return res.status(404).json({
      status: "false",
      message: "Invalid Id",
    });
  }

  const restaurantFound = await restaurantModel.findById(id);
  if (!restaurantFound) {
    return res.status(404).json({
      status: "false",
      message: "restaurant not found",
    });
  }

  return res.status(200).json({
    status: "success",
    user: restaurantFound,
  });
});


const approveCommentAdminController = expressAsyncHandler(
    async (req, res) => {
      const { commentId } = req.params;
  
      // check if restaurant details are passed correctly
      if (!isValidObjectId(commentId.toString())) {
        throw new error("Invalid commentId Id");
      }
  
      // find if user already exist
  
      const restaurant = await commnetModel.findById(commnentId);
      const { restaurantStatus, userId, restaurantName } = restaurant;
  
      const { fullName, email } = await UserModel.findById(userId);
  
      if (restaurantStatus === "approved") {
        res.status(200).json({
          status: "success",
          message: "Restaurant allready approved",
        });
        return;
      }
  
      restaurant.restaurantStatus = "approved";
  
      restaurant.save();
  
      const option = {
        subject: "Restaurant Approved",
        emailTemplate:
          "Congratulations " +
          fullName +
          " your restaurant " +
          restaurantName +
          " has been approved.",
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
        message: "Restaurant approved successfully",
      });
    }
);
 
const deleteUserAdminController = expressAsyncHandler(
    async (req, res) => {
      const { userId } = req.params;
  
        
        if (!userId) { 
   throw new Error("Missing credential")
        }
      // check if restaurant details are passed correctly
      if (!isValidObjectId(userId.toString())) {
        throw new error("Invalid user Id");
      }
  
      const restaurant = await UserModel.findOneAndDelete({
      _id: userId
      });
  
      if(!restaurant){
       throw new Error(`failed to delete user`)
        }
  
      return res.status(201).json({
        status: "success",
        message: "User deleted successfuly",
      });
    }
);




module.exports = { activateRestaurantAdminController, deleteUserAdminController, activateReviewAdminController };
