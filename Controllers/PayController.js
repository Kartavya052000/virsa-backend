//kartavya test
// const stripe = require('stripe')('sk_test_51ODkV4AH7tWiIHmOZh1w3EY7dSDEMjjXjiFgnN5NSkInnwc4I8wj5s8jNypvM59wHJPRdqcK4pojdMQqGGEPxNs80063qbmqIg');

//virsa test
// const stripe = require('stripe')('sk_test_51OlNSaGFRX0mGJ8pt0b4PJVdj6J13KjPZz3g4JEP8TblhnBClX5VRtWB4MutyBa6isQNavWYT4irFWhHRc9y7Gyl00KIE9BdgY');

// virsa prod
const stripe = require('stripe')('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');

exports.Pay= async (req, res) => {
    // Use an existing Customer ID if this is a returning customer.
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: '2023-10-16'}
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000, // Amount in INR (smallest currency unit)
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
      // below is kartavya test
      // publishableKey: 'pk_test_51ODkV4AH7tWiIHmOF0t9QJE4KMdeXjC86OOcFlIuZ6wX9enYJ2E5LNpCIF1pR5jSmyQL28kr9UFXyyqzXuN7vBUL007BzK9dRh'
      // below is vira test
            // publishableKey: 'pk_test_51OlNSaGFRX0mGJ8pvxXdIbNolXrqf2gMXhFTCNV8wILFiFSl2eQ2tXzkQEhOXdrCYieM7s5kOMphjyyddzwWUADA00BR26k7v8'
// below is virsa prod
publishableKey: 'pk_live_51OlNSaGFRX0mGJ8phjM6ZEf28ZYFRCHA9bR7AcgsqM7bRkIDch8rJCYqkUd5siNh0AQOMjZtZ0VhQfIUKTXLNo4C00DhAVmA4n'

    });
    // kartavya key
      // publishableKey: 'pk_test_51ODkV4AH7tWiIHmOF0t9QJE4KMdeXjC86OOcFlIuZ6wX9enYJ2E5LNpCIF1pR5jSmyQL28kr9UFXyyqzXuN7vBUL007BzK9dRh'
      //virsa key
  }