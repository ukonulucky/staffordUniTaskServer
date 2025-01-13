// third party libraries
require("dotenv").config()
const express = require('express');
const cors = require('cors')
const cookieParser = require("cookie-parser")


// third party libraries


// from my application
const dbConnetFunc = require('./config/db/dbConnect');



const userRouter = require("./routes/user/userRoute");
const restaurantRouter = require("./routes/restaurant/restaurant");
const foodRouter = require("./routes/food/food");
const reviewRouter = require("./routes/review/review");
const adminRouter = require("./routes/admin/admin");


const PORT = process.env.PORT || 5000
const app = express();

// cors configuration

const corsOptions = {
    origin:["http://localhost:5173",process.env.CLIENT_URL],
    methods: ["GET","HEAD","PUT","PATCH","POST","DELETE"],
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
}

//Middleware

app.use(cookieParser())
app.use(express.json())
app.use(cors(corsOptions))





// Routes



app.use("/api/v1/admin", adminRouter)


app.use("/api/v1/food", foodRouter)

app.use("/api/v1/review", reviewRouter)

app.use("/api/v1/user", userRouter)
 
app.use("/api/v1/restaurant", restaurantRouter)


app.use("/", async(req, res) => { 
    res.send("Server running")
   })

app.use((req, res, next) => {
    res.status(404).json({
        message:"route not found"
    })
})



app.use((err, req, res, next) => {
    const errorMessage = err.message
    // the stack proprty tells what area in the application the error happenz
    const stack = err.stack
res.status(500).json({
    message: errorMessage,
    stack
})

})

const connetDbAndServer = async () => {
     
    try {
        const res = await dbConnetFunc()
        if(res){
            app.listen(PORT, function(){
                console.log(`Db connected and server listening on port now ${PORT}`)
            })
        }
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}


connetDbAndServer()

