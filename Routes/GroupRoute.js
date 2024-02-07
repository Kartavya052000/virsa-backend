const router = require('express').Router()
const {getGroups, } = require("../Controllers/GroupController")
const userVerification = require('../Middleware/AuthMiddleware')



router.get("/groups",userVerification,getGroups)

module.exports = router;
