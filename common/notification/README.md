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

## Campaigns

The Notification System can also be used to run Campaigns, although it was not initially designed for it - thus campaigns clash a bit of the design of the notification system.

Usually for each and every campaign one would have to create a separate Notification, however there are also "repetitive campaigns" (i.e. course promotions) where only small text parts change. We model this by treating the notification as the "campaign template" and not the "campaign" itself (Notification ("campaign template") -> "campaign" -> concrete notification). As we don't really have a good place to store campaign information, we write them into the concrete notifications instead, and reuse the contextID (uniqueId) as the campaign identifier:

**(Campaign) Notifications**

| ID  | description     | mailjetTemplateId | type     | sample_context                 |
| --- | --------------- | ----------------- | -------- | ------------------------------ |
| 1   | Campaign        | NULL              | campaign | { overrideMailjetTemplate: 1 } |
| 2   | Course Campaign | 10                | course   | { courseName: "Beispielkurs" } |

**Concrete Notification**

| NotificationID | UserID    | ContextID | Context                                             |
| -------------- | --------- | --------- | --------------------------------------------------- |
| 1              | pupil/1   | Camp. 1   | { campaign: "Camp. 1", overrideMailjetTemplate: 1 } |
| 1              | pupil/2   | Camp. 1   | { campaign: "Camp. 1", overrideMailjetTemplate: 1 } |
| 1              | student/1 | Camp. 2   | { campaign: "Camp. 1", overrideMailjetTemplate: 2 } |
| 1              | student/2 | Camp. 2   | { campaign: "Camp. 1", overrideMailjetTemplate: 2 } |
| 2              | student/1 | Camp. 3   | { campaign: "Camp. 1", courseName: "Kurs 10" }      |

For specialized campaigns one can write `overrideType` and `overrideMailjetTemplate` into the context, to specify different mailjet templates and types per campaign (for "non generic campaigns"). For repetitive campaigns, one can just pass in specific information via the context, that can be used during template rendering.

Usually a Notification is triggered via a Backend Action, and thus the context is known from the code. For campaigns however,
the context is typed in by the user creating the campaign, thus we need some way to determine all the context fields that are needed.
This is done by storing a `sample_context` in the Notification, which can be used to validate templates against it, and on the other hand can be used to validate contexts specified when creating a campaign. As this is needed for every campaign, a Notification is a campaign notification if it has a sample_context.

To send out a campaign, one has to pick a campaign notification, create a context that has all the fields of the sample context as well as a uniqueId for the specific campaign, and then create a concrete notification for every user that is supposed to get the notification. These concrete notifications are first created in `DRAFT` state, then when a campaign is released they are moved to `DELAYED` state - and are just picked up like reminders by the background job. To cancel a campaign, all the concrete notificiations are moved to `ACTION_TAKEN` state. After three months, they are archived like other notifications.

The notification system background job can send about 1000 mails per minute (mainly limited by the Mailjet API). As the background job is triggered every 10 minutes, we should avoid scheduling more than 10.000 notifications at a time. To prevent that, and to prevent a thundering herd of users clicking on links in mails (although that has not happened so far), when creating the concrete notifications they are distributed over a period of time, so that they are continously picked up by the background job.

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
A: Sometimes nothing, we raised this issues to Mailjet and this will hopefully be fixed on their end.
Usually we do get an email though to `backend@` for every failed render.

Q: What if the backend crashes while sending out emails?
A: Then "pending" concrete notifications will hang around in the database. We might be able to automatically recover from this in the future

Q: How can I check that my newly created reminder / notification works?
A: Check the concrete notifications for errors / successfully sent ones

Q: Can we also sent out [insert medium here]?
A: Sure! Just implement the `Channel` interface, add a new template ID column to Notification, and you're ready to go.
