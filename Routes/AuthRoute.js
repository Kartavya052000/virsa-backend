const router = require('express').Router()
const {Login,SignUp, GetMyProfile, VerifyOTP, googleLogin} = require("../Controllers/AuthController")
const userVerification = require('../Middleware/AuthMiddleware')

router.post('/login', Login)
router.post('/login-google', googleLogin)
router.post('/signup', SignUp)
router.post('/verify-otp', VerifyOTP)
router.get('/my-profile',userVerification, GetMyProfile)


module.exports = router
