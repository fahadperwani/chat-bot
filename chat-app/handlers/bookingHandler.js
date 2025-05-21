class BookingHandler {
    /**
     * Returns the next parameter that is missing from the parameters object.
     * @param {Object} parameters - The parameters object.
     * @returns {string} The name of the next missing parameter.
     */
    static getNextMissingParam(parameters) {
        // Loop through the parameters in the correct order.
        const paramsOrder = ['origin', 'destination', 'passengers', 'class'];
        for (const param of paramsOrder) {
            // If a parameter is missing, return its name.
            if (!parameters[param]) return param;
        }
        // If all parameters are present, return null.
        return null;
    }

    /**
     * Handles the booking process.
     * @param {Object} parameters - The parameters object.
     * @returns {Object} An object with the text to be sent and the context.
     */
    static handle(parameters) {
        // Get the next missing parameter.
        const missingParam = this.getNextMissingParam(parameters);
        // If all parameters are present, ask for confirmation.
        if (!missingParam) {
            return {
                // The text to be sent.
                text: `Confirm: ${parameters.origin} → ${parameters.destination}, ` +
                    `${parameters.passengers} passengers, ${parameters.class} class. Correct?`,
                // The context to be set.
                context: 'awaiting_confirmation',
            };
        }

        // The prompts for the missing parameter.
        const prompts = {
            origin: 'Where are you flying from and where would you like to go?',
            destination: 'Where is your destination?',
            passengers: 'How many passengers are traveling and in which class would you prefer?',
            class: 'Which class? (Economy/Business)',
        };

        // The response to be sent.
        return {
            // The text to be sent.
            text: prompts[missingParam],
            // The context to be set.
            context: `awaiting_${missingParam}`,
        };
    }
}

module.exports = BookingHandler;