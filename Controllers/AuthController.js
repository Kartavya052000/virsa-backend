const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const twilio = require("twilio"); // Import Twilio library

const accountSid = "AC74dd929ef395571bdde55867baab069b";
const authToken = "ed482e2d836aee3400266e0e2e59a464";
const verifySid = "VA406eacded6f9e80ac5be3bf4871da0f5";
const client = twilio(accountSid, authToken);

module.exports.SignUp = async (req, res, next) => {
  try {
    const { fullname, email, password, code, phoneNumber } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
//     const concatenatedPhoneNumber = `+${code}${phoneNumber}`;
// console.log(concatenatedPhoneNumber)
    // Generate random 6-digit OTP
    // const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Send OTP to the provided phone number
    // client.verify.v2
    //   .services(verifySid)
    //   .verifications.create({ to: concatenatedPhoneNumber, channel: "sms" })
    //   .then(() => {
    //     // Hash the password
    //     return bcrypt.hash(password, 10);
    //   })
    //   .then((hashedPassword) => {
    //     // Create a new user
    //     const newUser = new User({
    //       fullname,
    //       email,
    //       password: hashedPassword,
    //       code,
    //       phoneNumber,
    //       otpCode, // Store the OTP in the user object
    //     });

    //     return newUser.save();
    //   })
    //   .then((newUser) => {
    //     // Create JWT token
    //     const token = createSecretToken(newUser._id);

    //     res.cookie("token", token, {
    //       withCredentials: true,
    //       httpOnly: false,
    //     });

    //     res.status(201).json({ message: "OTP sent for verification", success: true, token: token, role: "User", user: newUser });
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     res.status(500).json({ message: "Error in OTP verification", error: error.message });
    //   });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.Login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.json({ message: "All fields are required" });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.json({ message: "Incorrect password or email" });
      }
      const auth = await bcrypt.compare(password, user.password);
      console.log(auth)
      if (!auth) {
        return res.json({ message: "Incorrect password or email" });
      }
  
      const token = createSecretToken(user._id);
  
      // if (user.isAdmin) {
      //   // For admin users
      //   res.cookie("adminToken", token, {
      //     withCredentials: true,
      //     httpOnly: false,
      //   });
      //   res.status(201).json({ message: "Admin logged in successfully", success: true, token: token,role:"Admin" });
      // } else {
      // For regular users
      res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false,
      });
      res.status(201).json({ message: "User logged in successfully", success: true, token: token, role: "User" ,user});
      // }
      next();
    } catch (error) {
      console.error(error);
    }
  };