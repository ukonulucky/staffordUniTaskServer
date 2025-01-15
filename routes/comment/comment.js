const express = require("express");
const { addCommentController, getAllCommentController } = require("../../controllers/comment/commentController");



const commentRouter = express.Router();

 commentRouter.post("/create", addCommentController); 
commentRouter.get("/getAllComments", getAllCommentController); 



module.exports = commentRouter;
