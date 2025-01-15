const expressAsyncHandler = require("express-async-handler");
const isValidObjectId = require("../../utils/mongooseIdValidity");
const CommentModel = require("../../model/comment");








// add food to restaurant controller
const addCommentController = expressAsyncHandler(async (req, res) => {
    // check if restaurant details are passed correctly

    const { userId, comment, reviewId } = req.body;
  if (!userId || !comment || !reviewId ) {
    throw new Error("Missing credentials");
  }

  
    if (!isValidObjectId(reviewId) || !isValidObjectId(userId)) { 
 throw new error("Invalid review or userId")
    }

  // find if user already exist

    const newComment = await CommentModel.create({
        userId, 
        comment,
        reviewId
    } );

  if (!newComment) {
    throw new Error("Failed to create comment");
  }
    
  return res.status(201).json({
    status: "success",
    message: "Comment created successfully",
    comment: newComment
  });
});

/* updated food */

const getAllCommentController = expressAsyncHandler(async (req, res) => {
    // get all comments
    const comments = await CommentModel.find();

    return res.status(201).json({
        status: "success",
        message: "Comment fetched successfully",
      comments
      })

})
 







module.exports = { addCommentController, getAllCommentController};
