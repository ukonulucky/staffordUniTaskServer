const mongoose = require("mongoose");
const restaurantSchema = new mongoose.Schema({
  restaurantName: { type: String, required: true, unique: true },
  about: { type: String, default: null },
  gallery: [{ url: { type: String, required: true, default: null } }],
  location: { type: String, default: null },
  totalReviews: { type: Number, default: 0 },
  totalResponded: { type: Number, default: 0 },
  totalNotResponded: { type: Number, default: 0 },
  restaurantStatus: {
    type: String,
    enum: ["pending", "approved", "deleted"],
    default: "pending",
  },
  phone: { type: Number, default: null }
},  { timestamps: true });
const restaurantModel = mongoose.model("Restaurant", restaurantSchema);

module.exports = restaurantModel;
