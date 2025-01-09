const mongoose = require('mongoose');

const MONGODB_URL = process.env.MONGODB_URL


const dbConnetFunc = async() => {
  try {
 const res =    await mongoose.connect(MONGODB_URL, {
         useUnifiedTopology: true,
         useNewUrlParser: true,
 })
      
      
       // Log a successful connection
    console.log('MongoDB connected successfully');

    // You can also add event listeners to monitor MongoDB connection status
    mongoose.connection.on('connected', () => {
      console.log('Mongoose default connection is open');
    });

    mongoose.connection.on('error', (err) => {
      console.log(`Mongoose default connection has occurred ${err} error`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose default connection is disconnected');
    });
      
    return res
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
   throw new Error(`MongoDb error: ${error.message}`)
  }
}


module.exports = dbConnetFunc