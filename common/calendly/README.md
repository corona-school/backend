## Development

To set up your development environment for the Calendly integration:

-   Setup local variables as per the `.env.example` file (Ask the Tech team for the development values)
-   Using [ngrok](https://developer.calendly.com/api-docs/adf83e8f05e54-webhook-examples#use-ngrok-to-listen-for-webhook-events) or a similar tool, expose your local server to the internet to receive webhook events from Calendly.
-   [Create a subscription](https://developer.calendly.com/api-docs/c1ddc06ce1f1b-create-webhook-subscription) for Calendly webhooks using their API, pointing to your ngrok URL _(With cURL, postman, etc...)_. The necessary parameters/values for this to work are
    -   url: `https://your-ngrok-url.ngrok-free.app/api/calendly/event` (Replace `your-ngrok-url` with your actual ngrok URL)
    -   events: ["invitee.created", "invitee.canceled", "invitee_no_show.created", "invitee_no_show.deleted"]
    -   organization: `test-organization-url` (Ask the Tech team for this value)
    -   scope: `user`
    -   user: `test-user-url` (Ask the Tech team for this value)
    -   signing_key: Some random string (Make sure to set the same value in your `.env` file for `CALENDLY_WEBHOOK_SIGNING_KEY`)

After this the development environment should be set up and you can start testing the Calendly integration locally booking Screening appointments from the user-app.
