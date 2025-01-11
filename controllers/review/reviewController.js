const expressAsyncHandler = require("express-async-handler");
const isValidObjectId = require("../../utils/mongooseIdValidity");
const sendBrevoEmail = require("../../utils/services/mailSender");
const ReviewModel = require("../../model/review");
const UserModel = require("../../model/user");

// create review controller
const createReviewController = expressAsyncHandler(async (req, res) => {
  const { restaurantId, rating, comment, userId} = req.body;

    console.log("this is the request body", req.body)
    
  // check if right parameter were sent
  if (!restaurantId || !rating || !comment || !userId) {
    throw new Error("Missing credentials");
  }

    /* check validity of mongoose Id */

    const isUserIdVallid = isValidObjectId(userId.toString());
    const isRestaurantIdVallid = isValidObjectId(restaurantId.toString());

    if (!isUserIdVallid || !isRestaurantIdVallid) {
     throw new Error("Invaild user or restaurant Id")
    }

 /* create a review */
    const newReview = await ReviewModel.create({
        restaurantId,
        userId,
        rating,
        comment
    })
    /* get user creating review */
    const { fullName, email } = await UserModel.findById(userId)

  /* send email for verification */


  /*    sendBrevoEmail(option2) */
  const option = {
    subject: "Review creation",
    emailTemplate:
      "Hello " + fullName + " your review has been created and awaits admin approval",
    to: [
      {
        email: email,
        name: fullName,
      }
    ],
  };

  sendBrevoEmail(option);



  return res.status(201).json({
    status: "success",
    message: "Review created successfully"
  });
});

const getAllReviewsController = expressAsyncHandler(async (req, res) => {
  try {
      const reviews = await ReviewModel.find().populate("userId").exec();
      
      
    return res.status(201).json({
      status: "success",
      reviews
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleReviewController = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new Error("Missing credentials");
      }
  const isIdVallid = isValidObjectId(id.toString());
    if (!id || !isIdVallid) {
      throw new Error("Invalid Id")
  }

  const reviewFound = await ReviewModel.findById(id);
  if (!reviewFound) {
    return res.status(404).json({
      status: "false",
      message: "review not found",
    });
  }

  return res.status(200).json({
    status: "success",
   review: reviewFound
  });
});

const deleteSingleReviewController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new Error("Missing credentials");
  }

  // delete review

    const deletedReview = await ReviewModel.findByIdAndDelete(id);
    

    if (deletedReview) {
        return res.status(201).json({
            status: "success",
            message: "Review deleted successfully"
        });
    } else { 
        throw new Error("Failed to delete review")
    }
  
});

const deleteAllReviewController = expressAsyncHandler(async (req, res) => {

    // delete all review
    const deletedReview = await ReviewModel.deleteMany({});

  
      if (deletedReview) {
          return res.status(201).json({
              status: "success",
              message: "All review deleted successfully"
          });
      } else { 
          throw new Error("Failed to delete all review")
      }
    
});
  
module.exports = {
    createReviewController,
    getAllReviewsController,
    getSingleReviewController,
    deleteSingleReviewController,
    deleteAllReviewController
};
