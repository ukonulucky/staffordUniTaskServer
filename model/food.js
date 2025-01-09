const mongoose = require("mongoose");

 const foodSchema = new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', 
   required: true },
    foodName: { type: String, required: true, trim: true },
    foodDescription: { type: String, required: true, trim: true }, 
   price: { type: Number, required: true, min: 0 },
     image: {
         type: String,
         required: true
     }, 
     category: {
         type: String,
         enum: [
             "Beverages", 
             "Burgers",
             "Meat & Steaks",
             "Pastry",
             "Pizza",
             "Sandwiches",
             "Seafood",
             "Soup & Salads"
           ], 
     }
 
 },
 { timestamps: true }
); 
 
const foodModel = mongoose.model('RestaurantFood', foodSchema);
module.exports = foodModel
   






/*  */
