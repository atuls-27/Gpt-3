const errorHandler = require("../middlewares/errorMiddleware");
const User = require("../models/userModel");
const errorResponse = require("../utils/errorResponse");


// creating token and saving in cookie
 exports.sendToken = (user,statusCode , res)=>{
  const token = user.getJWTToken();

  // options for cookie
  const options = {
      expires : new Date(
          Date.now()  + process.env.COOKIE_EXPIRE *24 *60 *60 *1000
      ),
      httpOnly : true,
  };

  res.status(200).cookie("token" , token ,options).json({
      success:true,
      user ,
      token,
  });
};


//REGISTER
exports.registerContoller = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    //exisitng user
    const exisitingEmail = await User.findOne({ email });
    if (exisitingEmail) {
      return next(new errorResponse("Email is already register", 500));
    }
    const user = await User.create({ username, email, password });
    this.sendToken(user, 201, res);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//LOGIN
exports.loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return next(new errorResponse("Please provide email or password"));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(new errorResponse("Invalid Creditial", 401));
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new errorResponse("Invalid Creditial", 401));
    }
    //res
    this.sendToken(user, 200, res);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//LOGOUT
exports.logoutController = async (req, res) => {

  res.cookie("token" , null,{
    expires:new Date(Date.now()),
    httpOnly:true,

});


  return res.status(200).json({
    success: true,
    message: "Logout Succesfully",
  });
};