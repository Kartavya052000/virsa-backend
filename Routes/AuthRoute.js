const router = require('express').Router()
const {Login,SignUp, GetMyProfile, VerifyOTP, googleLogin, ResetPassword, ForgotPassword, ResetPasswordwithoutLogin, ResendOTP, EditProfile} = require("../Controllers/AuthController")
const userVerification = require('../Middleware/AuthMiddleware')

router.post('/login', Login)
router.post('/login-google', googleLogin)
router.post('/signup', SignUp)
router.post('/verify-otp', VerifyOTP)
router.post('/resend-otp', ResendOTP)
router.post('/forget-pass', ForgotPassword)
router.get('/my-profile',userVerification, GetMyProfile)
router.post('/edit-profile',userVerification, EditProfile)
router.post('/reset-password',userVerification, ResetPassword)
router.post('/reset-password-nologin', ResetPasswordwithoutLogin)

module.exports = router
