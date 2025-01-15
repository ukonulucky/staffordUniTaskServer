const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
          type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: { type: String },
    reviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }
    },
   
 
  { timestamps: true }
);
const CommentModel = mongoose.model("Comment", commentSchema);


module.exports = CommentModel
