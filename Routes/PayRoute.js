// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.
const router = require('express').Router()
const payController = require("../Controllers/PayController")
router.post('/payment-sheet',payController.Pay);

module.exports=router

