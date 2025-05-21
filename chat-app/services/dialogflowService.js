const { SessionsClient } = require('@google-cloud/dialogflow');
const uuid = require('uuid');

class DialogflowService {
    /**
     * Constructor for the Dialogflow Service.
     * 
     * @param {string} projectId - The Dialogflow project ID.
     * @param {string} keyFilename - The path to the service account key file.
     */
    constructor(projectId, keyFilename) {
        /**
         * The Dialogflow project ID.
         * @type {string}
         */
        this.projectId = projectId;

        /**
         * The Dialogflow sessions client.
         * @type {SessionsClient}
         */
        this.client = new SessionsClient({ keyFilename });
    }

    /**
     * Detects the intent of a given text.
     * 
     * @param {string} sessionId - The unique session ID.
     * @param {string} text - The text to detect the intent from.
     * @param {Array<Object>} [contexts] - The contexts to pass to Dialogflow.
     * @returns {Promise<string|null>} The response from Dialogflow or null if no response.
     */
    async detectIntent(sessionId, text, contexts = []) {
        // Create the session path.
        const sessionPath = this.client.projectAgentSessionPath(
            this.projectId,
            sessionId
        );

        // Create the request.
        const request = {
            // The session path.
            session: sessionPath,
            // The query input.
            queryInput: {
                // The text to detect the intent from.
                text: { text, languageCode: 'en-US' },
            },
            // The query parameters.
            queryParams: { contexts },
        };

        // Detect the intent.
        const [response] = await this.client.detectIntent(request);

        // Return the response or No response from Dialogflow if no response.
        return response.queryResult?.fulfillmentText || 'No response from Dialogflow';
    }
}

module.exports = DialogflowService;