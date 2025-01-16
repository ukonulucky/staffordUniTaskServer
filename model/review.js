const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewStatus: {
      type: String,
      enum: ["pending", "approved", "deleted"],
      default: "pending",
    },
    comment: {
      type: String,
      required: true
      

     },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
 
  { timestamps: true }
);
const ReviewModel = mongoose.model("RestaurantReview", reviewSchema);


module.exports = ReviewModel
