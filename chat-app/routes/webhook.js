const express = require('express');
const router = express.Router();
const BookingHandler = require('../handlers/bookingHandler');

// POST endpoint to handle Dialogflow webhook requests
router.post('/', (req, res) => {
    // Extract the intent name, parameters, and output contexts from the Dialogflow request
    const intent = req.body.queryResult.intent.displayName;
    const params = req.body.queryResult.parameters;
    const contexts = req.body.queryResult.outputContexts;

    let response;

    switch (intent) {
        // Welcome message when user initiates the chat
        case 'Default Welcome Intent':
            response = { fulfillmentText: 'Welcome! Would you like to book a flight?' };
            break;

        // Booking flow logic: initial or mid-booking steps
        case 'BookFlight':
        case 'PassengerIntent':
        case 'ClassIntent':
        case 'OriginIntent':
        case 'DestinationIntent':
        case 'BookingStep':
            // Call handler to process booking logic (e.g., validating user input, checking availability)
            const result = BookingHandler.handle(params);

            // Build a response including a custom context to maintain conversation state
            response = {
                fulfillmentText: result.text,
                outputContexts: [{
                    name: `${req.body.session}/contexts/${result.context}`, // Name the context uniquely using session ID
                    lifespan: 5, // Context lasts for 1 conversational turn
                    parameters: params, // Pass the same parameters to keep data in context
                }],
            };
            break;

        // Handle confirmation of the booking
        case 'Confirmation':
            response = {
                fulfillmentText: params.confirmation == 'true' ?
                    'Booking confirmed! 🎉' : 'Booking canceled.',
            };
            break;

        // Default fallback response for unrecognized intents
        default:
            response = { fulfillmentText: 'I didn’t understand that.' };
    }

    // Return the response back to Dialogflow
    res.json(response);
});

module.exports = router;
