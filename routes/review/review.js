const express = require("express");
const { createReviewController, getAllReviewsController, getSingleReviewController, deleteAllReviewController, deleteSingleReviewController } = require("../../controllers/review/reviewController");
const authenticateJWT = require("../../middleware/authenticateUser");

const reviewRouter = express.Router();

/* create review */
reviewRouter.post("/create", createReviewController); 

/* get all review */
reviewRouter.get("/reviews", getAllReviewsController);

/* get single review */
reviewRouter.get("/:id", getSingleReviewController);

/* delete all review */
reviewRouter.delete("/deleteAll", deleteAllReviewController);

/* delete single review */
reviewRouter.delete("/:id", deleteSingleReviewController);


module.exports = reviewRouter;
