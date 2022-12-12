# Notification System

**[List of Actions](./actions.ts#22)**

The notification system was introduced to make it possible for Admins to create reminders and notifications without making changes to the codebase each time. Core of the notification system are
**actions**, which is a certain thing a certain user does, e.g. they register.
Each action is identified by a unique ID, and has a **context**, which is a nested data structure which is relevant for the action the user takes. In the codebase the actions are triggered by calls to `Notification.actionTaken(actionID, user, context)`. The context can have a special _uniqueId_, which is used to identify actions for the "same thing", e.g. for the same course the uniqueId should be the course's ID.

How the notification system reacts to a certain action depends on the **notifications** maintained in the database. Each notification has an _onActions_ list, which determines on which action the notification is sent out. Additionally notifications that are supposed to be reminders have the _delay_ field set (time in ms) and have a _cancelledOnAction_ list. Reminders are sent out after the delay is over by a background job that runs daily, unless an action listed in the cancel list is triggered. If a reminder was created with a uniqueId, it will also only be cancelled by an action with the same uniqueId (e.g. a cancellation for Course B will not cancel the reminder for Course A).
Notifications can be toggled through their _active_ field.

Each notification can be sent over multiple **channels**, however currently there is just one Mailjet channel (though further ones are planned). Channels implement the `Channel` interface, and decide wether they can send a message through their `canSend` method and actually deliver the Notification when `send` is called. For Mailjet the Notification has a _mailjetTemplateId_, which if set maps to the template maintained in the Mailjet Service.

For each notification and reminder sent out to a user, a **concrete notification** gets stored in the database. Reminders are initially in the "delayed" state, and in "action_taken" state if they we're cancelled. They're in "pending" state if the backend is currently processing them, and they're "sent" if the Channel successfully sent them out (not necessarily delivered them successfully). If an error occured, the backend does not crash but stored the error in the concrete notification and changes the state to "error". Concrete Notifications also store the context (as reminders need to access the context at a later point in time).

Optionally a notification can trigger a **notification hook** when it is sent out. This makes sense for notifications which inform the user about changes to their account (e.g. that it is deactivated). The hook is a function in the backend which is then executed.
Thus by cancelling the notification or rescheduling it, one can influence whether and when the hook is run.

The Notification System can also be used to run **Campaigns**. A campaign is uniquely identified by a notification and a corresponding context (identified by the context's uniqueId, known as the contextID).
To create a campaign for a notification, one only has to create a concrete notification for every user that is supposed to receive the campaign. To be able to double check the campaign before sending, the concrete notifications are created in draft state and can then be released.
All notifications that can be used for campaigns should be of category 'campaign' so that they show up properly in the Retool, they should have an 'example_context' for the Retool UI to fill the context to work correctly, and the context should contain a 'campaign' field, which will be used in Mailjet to group statistics for the campaign together.

## How do I create a new Notification / Reminder?

1. Create a new Mailjet Template (or SMS Template or ...)
2. Create a new entry in the Notification Database (with `active: false`!)
    1. Set the `mailjetTemplateId` to the one from the Mailjet Template
    2. Choose the actions that should trigger the reminder / notification into `onActions`
    3. For Reminders set the `delay` and `cancelOnAction` fields
3. Check the Action documentation for variables that are available in all of them, and insert them into the template (e.g. `{{var:user.firstname}}`)
4. Test the notification (not sure how though :))
5. Remove the old way of sending the email from the codebase
6. Switch on the notification (this will be possible in Retool)

## What happens if ...

Q: What if there is an Action without Notifications?
A: Nothing

Q: What if there's a Notification without any Channel that can send it (no template)?
A: Sending out the notification will error.

Q: What if a Mail cannot be delivered to the user?
A: In the future, this will be indicated through the concrete notification being moved into "error" state

Q: What if the template ID has a typo / the Template has syntax errors?
A: Nothing, we raised this issues to Mailjet and this will hopefully be fixed on their end

Q: What if the backend crashes while sending out emails?
A: Then "pending" concrete notifications will hang around in the database. We might be able to automatically recover from this in the future

Q: How can I check that my newly created reminder / notification works?
A: Check the concrete notifications for errors / successfully sent ones

Q: Can we also sent out [insert medium here]?
A: Sure! Just implement the `Channel` interface, add a new template ID column to Notification, and you're ready to go.
