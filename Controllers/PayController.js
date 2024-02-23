require("dotenv").config();



const {stripe_secret,publish_key}= process.env

const stripe = require('stripe')(stripe_secret);

exports.Pay= async (req, res) => {
  const{amount}=req.body
  console.log(amount)
    // Use an existing Customer ID if this is a returning customer.
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: '2023-10-16'}
    );
    const paymentIntent = await stripe.paymentIntents.create({
      // amount: amount*100, // Amount in INR (smallest currency unit)
      amount: 1000, // Amount in INR (smallest currency unit)
      currency: 'inr',
      customer: customer.id,
      
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,

publishableKey: publish_key

    });
  
  }