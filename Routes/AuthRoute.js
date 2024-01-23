const router = require('express').Router()
const {Login,SignUp} = require("../Controllers/AuthController")

router.post('/login', Login)
router.post('/signup', SignUp)


module.exports = router
