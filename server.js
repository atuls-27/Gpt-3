const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const errorHandler = require("./middlewares/errorMiddleware");


//routes path
const authRoutes = require("./routes/authRoutes");


//dotenv
dotenv.config();

//mongo connection
connectDB();

//rest object
const app = express();


//middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(errorHandler)

const PORT = process.env.PORT || 8080;


//API routes
app.use("/api/v1/auth", authRoutes);
//we can use require/openaiRoutes by importing it upward also
app.use("/api/v1/openai", require("./routes/openaiRoutes"));

//listen server
app.listen(PORT, () => {
    console.log(
      `Server Running in ${process.env.DEV_MODE} mode on port no ${PORT}`
    );
  });