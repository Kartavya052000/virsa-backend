const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const twilio = require("twilio"); // Import Twilio library

// const accountSid = "AC74dd929ef395571bdde55867baab069b";
// const authToken = "ed482e2d836aee3400266e0e2e59a464";
// const verifySid = "VA406eacded6f9e80ac5be3bf4871da0f5";
// const client = twilio(accountSid, authToken);
const transporter = require('../nodemailerConfig');

const generateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // Expiry time: 10 minutes
  return { otp, expirationTime };
};


// Function to send OTP via email
const sendOTPByEmail = async (email, otp) => {


  const mailOptions = {
    from: "kartavyabhayana1@gmail.com",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP for verification is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};
module.exports.SignUp = async (req, res, next) => {
  try {
    const { fullname, email, password, countryCode, phoneNumber,nationality } = req.body;
    let existingUser = await User.findOne({ email });

    // Check if email already exists
    if (existingUser) {
      if (!existingUser.verified) {
        // Delete the existing user with unverified status
        await User.deleteOne({ email });
      } else {
        return res.status(400).json({ message: "Email already exists" });
      }
    }
    const { otp, expirationTime } = generateOTP();

    // Send OTP via email
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const newUser = new User({
          fullname,
          email,
          password: hashedPassword,
          countryCode,
          phoneNumber,
          nationality,
          otp: otp, // Save OTP in the user document
          otpExpiration: expirationTime,
          provider:"local"
        });
        const token = createSecretToken(newUser._id);
        await newUser.save();
    await sendOTPByEmail(email, otp);

        res.status(201).json({ message: "Otp Sent  successfully", success: true});
        next();
      
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.VerifyOTP = async (req, res, next) => {
  try {
    const { email, enteredOTP,location } = req.body;
    // Retrieve the signup details from the User model
    const user = await User.findOne({ otp:enteredOTP });
    if (!user) {
      // return res.status(400).json({ message: "Signup details not found" });
      return res.status(400).json({ message: "Incorrect OTP" });

    }
console.log(user.otp,"OTPPPPPP")
    // Check if OTP is expired
    if (user.otpExpiration < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Check if the entered OTP matches the stored OTP
    if (enteredOTP != user.otp) {
      return res.status(400).json({ message: "Incorrect OTP" });
    }
    const token = createSecretToken(user._id);

 if(location=="signup"){
  user.verified =true
 await user.save();


  res.status(201).json({ message: "User logged in successfully", success: true, token: token, role: "User", user: user })
 }else{
  res.status(201).json({ message: "Otp Verified Successfully", success: true, token: token, })

 }


    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports.ResetPassword = async (req,res,next) => {
try{
  const {newPassword } = req.body;
  const userId = req.user._id;
console.log(userId)
  const user = await User.findById(userId);

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  // Update the user's password in the database
  user.password = hashedPassword;
  // await user.save();
  await user.save({ validateBeforeSave: false }); // Exclude validation


  res.status(200).json({ message: "Password changed successfully" });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
}
}
module.exports.ResetPasswordwithoutLogin = async (req,res,next) => {
  try{
    const {email,newPassword } = req.body;
    const user = await User.findOne({email});
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update the user's password in the database
    user.password = hashedPassword;
    // await user.save();
    await user.save({ validateBeforeSave: false }); // Exclude validation
  
  
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
  }
  module.exports.Login = async (req, res, next) => {
      try {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "Incorrect password or email" });
        }
        // Check if the user is verified
      if (!user.verified) {
        return res.json({ message: "User not verified" });
      }
        const auth = await bcrypt.compare(password, user.password);
        console.log(auth)
        if (!auth) {
          return res.json({ message: "Incorrect password or email" });
        }
    
        const token = createSecretToken(user._id);
        // res.cookie("token", token, {
        //   withCredentials: true,
        //   httpOnly: false,
        // });
        res.status(201).json({ message: "User logged in successfully", success: true, token: token, role: "User" ,user});
        // }
        next();
      } catch (error) {
        console.error(error);
      }
    };
  module.exports.googleLogin = async (req, res, next) => {
    try {
      const { name, id,email } = req.body;
      console.log(name, id, email,"YYYYYY");
      let user = await User.findOneAndUpdate(
        { googleId: id },
        { fullname: name, email, provider: "google",verified:true },
        { upsert: true, new: true }
    );
    
  
      const token = createSecretToken(user._id);
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
  module.exports.GetMyProfile = async (req, res, next) => {
    try {
      // Extract the user ID from the authenticated user's token
      const userId = req.user._id;
  
      // Find the user profile by ID
      const userProfile = await User.findById(userId);
  
      if (!userProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }
  
      res.status(200).json({ success: true, user: userProfile });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
module.exports.EditProfile = async (req,res,next)=>{
    try {
      // Extract the user ID from the authenticated user's token or session
      const userId = req.user._id;
  
      // Extract updated profile data from the request body
      const { fullname, email, countryCode, phoneNumber, nationality } = req.body;
  
      // Find the user profile by ID and update it
      const updatedUserProfile = await User.findByIdAndUpdate(userId, {
        fullname,
        email,
        countryCode,
        nationality,
      }, { new: true });
  
      if (!updatedUserProfile) {
        return res.status(404).json({ message: 'User profile not found' });
      }
  
      res.status(200).json({ success: true, user: updatedUserProfile });
      next()
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  
}
  module.exports.ForgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      console.log("email: " + email)
      let existingUser = await User.findOne({ email });
  
      // Check if email already exists
      if (!existingUser) {
        if (!existingUser.verified) {
          // Delete the existing user with unverified status
          return res.status(400).json({ message: "Email not Verified" });
        }
          return res.status(400).json({ message: "Email Does not exists, Please Signup" });
      }
      const { otp, expirationTime } = generateOTP();
 
       existingUser.otp = otp;
       existingUser.otpExpiration = expirationTime;
  await existingUser.save({ validateBeforeSave: false }); // Exclude validation

      await sendOTPByEmail(email, otp);
  
          res.status(201).json({ message: "Otp Sent  successfully", success: true});
          next();
        
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  module.exports.ResendOTP = async (req, res, next) => {
    try {
      const { email } = req.body;
  
      // Find the user by email
      const existingUser = await User.findOne({ email });
  
      // Check if user exists
      if (!existingUser) {
        return res.status(400).json({ message: "Email does not exist" });
      }
  
      // // Check if user is verified
      // if (!existingUser.verified) {
      //   return res.status(400).json({ message: "Email not verified" });
      // }
  
      // Generate new OTP and expiration time
      const { otp, expirationTime } = generateOTP();
  
      // Update user's OTP and OTP expiration time
      existingUser.otp = otp;
      existingUser.otpExpiration = expirationTime;
      await existingUser.save();
  
      // Send OTP via email
      await sendOTPByEmail(email, otp);
  
      // Respond with success message
      res.status(201).json({ message: "OTP Resent successfully", success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  