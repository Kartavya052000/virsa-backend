const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userVerification = async (req, res, next) => {
  try {

    // const token = req.cookies.token;
    const token = req.headers.authorization;
// console.log(token,"TTTTTT")

    if (!token) {
      return res.json({ status: false });
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);

    const user = await User.findById(decodedToken.id);
    if (user) {
      // Attach the user object to the request for later use
      req.user = user;
      return next(); // Call the next middleware or route handler
    } else {
      return res.json({ status: false });
    }
  } catch (error) {
    // Handle any errors that may occur during verification or database lookup
    console.error(error);
    return res.json({ status: false });
  }
};

module.exports = userVerification;
