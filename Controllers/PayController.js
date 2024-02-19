const stripe = require('stripe')('sk_test_51ODkV4AH7tWiIHmOZh1w3EY7dSDEMjjXjiFgnN5NSkInnwc4I8wj5s8jNypvM59wHJPRdqcK4pojdMQqGGEPxNs80063qbmqIg');



exports.Pay= async (req, res) => {
    // Use an existing Customer ID if this is a returning customer.
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: '2023-10-16'}
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 109900, // Amount in INR (smallest currency unit)
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
      publishableKey: 'pk_test_51ODkV4AH7tWiIHmOF0t9QJE4KMdeXjC86OOcFlIuZ6wX9enYJ2E5LNpCIF1pR5jSmyQL28kr9UFXyyqzXuN7vBUL007BzK9dRh'
    });
  }