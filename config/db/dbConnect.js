const mongoose = require('mongoose');

const MONGODB_URL = process.env.MONGODB_URL


const dbConnetFunc = async() => {
  try {
 const res =    await mongoose.connect(MONGODB_URL, {
         useUnifiedTopology: true,
         useNewUrlParser: true,
    })
    return res
  } catch (error) {
    console.log("new error")
   throw new Error(`MongoDb error: ${error.message}`)
  }
}


module.exports = dbConnetFunc