# INTEGRATED CHAT

## Overview

This project utilizes the [TalkJS API](https://talkjs.com/docs/) to provide an integrated chat functionality in our React app. TalkJS allows to facilitate real-time communication between users.

## 💬 Conversation IDs for 1:1 Chats and Group Chats

Two different types of Conversation IDs are used to distinguish between 1:1 chats and group chats. The conversation IDs are essential for identifying and managing different chat sessions in the TalkJS API.

-   1:1 Chat Conversation IDs
    For one-on-one chats, we create a unique Conversation ID dynamically. This ID is not stored in the database since it can be easily generated on-the-fly based on the two participants' IDs.
-   Group Chat Conversation IDs
    On the other hand, for group chats, we generate random UUIDv4 Conversation IDs. UUIDv4 ensures that the generated IDs are globally unique and suitable for identifying group chat sessions. The group chat Conversation ID is always associated with a specific subcourse in our database.

## ⚡️ Metadata

We utilize custom metadata during the creation of chats to provide additional context and information. Depending on whether it's a group chat or a 1:1 chat, the custom metadata contains different properties. The metadata is necessary first to show correct data on the chat and also to get further informations, i.e. to deactivate if subcourse is over or match is dissolved.

### 👥 Group Chat Custom Metadata

For group chats, the custom metadata includes the following properties:

-   `start`: indicates the first event of the course.
-   `groupType`: Specifies the type of the group chat. It can be either `NORMAL` or `ANNOUNCEMENT`.
-   `subcourse`: An array containing the IDs of the subcourses for which the group chat was created.
    In the case of an "announcement" group chat, only the instructor has readwrite rights, while other participants have read rights.

### 👤 1:1 Chat Custom Metadata

For 1:1 chats, the custom metadata includes the following properties:

-   `match?`: contains the ID of the match associated with the chat.
-   `subcourse?`: An array containing the IDs of the subcourses relevant to the 1:1 chat, depending on the context. For example, if the chat is about contacting a course instructor, it may contain the ID of the relevant subcourse. Similarly, if its about contacting a match partner, it may contain the ID of the relevant subcourse.
-   `prospectSubcourse?`: If the chat is initiated to contact a course participant for a specific subcourse of interest, this property contains the ID of that subcourse.

## 🔁 Chat Deactivation and Reactivation

The chats are only deacticated rather than deleting chats permanently. Chats are deactivated to allow for reactivation at a later stage if needed. An automated process was implemented to deactivate chats using a cron job called `flagInactiveConversationsAsReadonly`. The deactivation occurs after 30 days when there is no longer a valid reason for the chat to remain active. The 30-day period for deactivation allows participants to continue using the chat for the initial 30 days after its last relevant activity. Once deactivated, the chat becomes access to `none` for all participants, preventing any further modifications or interactions.
The reasons for chat deactivation include:

-   **Match Dissolution**: If a match between chat participants was dissolved more than 30 days ago, the chat is no longer considered relevant and is deactivated.
-   **Subcourse Completion**: If the associated subcourse for the chat has ended more than 30 days ago, the chat serves no further purpose and is deactivated.

Deactivated chats can be reactivated if necessary. When a participant accesses a deactivated chat, they will have the option to reactivate it, triggering the chat to become active again.

## Webhook for missed messages

The webhook's main purpose is to detect when a user misses a regular chat message (not system messages). When the webhook receives the `notification.trigger` action for a missed regular message, it generates a Lern-Fair notification. This notification is sent to the user in-app and via email to inform them about the missed message. By doing so, we ensure that users are promptly notified about any missed important communications within the chat.

## ⚙️ System Messages

System messages are send to communicate important events and actions within chats.

**Events:**

-   `First Messages`: The "First" system message is sent when a new chat conversation is initiated. We use it to welcome users and provide any necessary instructions for using the chat.
-   `Group Chat Type Changed`: The "Group Changed" system message is sent when the type of a group chat is changed (from 'normal' to 'announcement', or other way round). It notifies participants about the changes and any updates related to the group chat.
-   `Chat Deactivation`: The "Group Over" system message is sent when a group chat or a 1:1 chat is deactivated. It notifies users that the chat is no longer active and provides relevant information about the deactivation.
-   `Chat Reactivation`: The "Group Reactivate" and "1:1 Reactivate" system messages are sent when a deactivated chat is reactivated. These messages inform users that the chat is active again and can be used for communication.

## 🎨 Customizing

TalkJS customization features is used to create a tailored chat. TalkJS offers a Dashboard where we can customize the chat theme, along with various user settings, to enhance the overall chat functionality.

### Custom Chat Theme

With TalkJS Dashboard, we can easily create a custom chat theme to match our application's branding and design.

-   User Settings
    TalkJS Dashboard empowers us to configure various user settings, enabling us to offer a personalized chat experience for our users. Some of the key user settings we can adjust include:

    -   **File Upload**
    -   **Voice Messages**
    -   **Profanity Filter**
        To maintain a positive and respectful communication environment, we have the option to enable a profanity filter. The filter helps identify and moderate offensive language in chat messages, ensuring a safe and appropriate chat experience for all users. (REGEX)
    -   **Custom Message Actions**
        With this feature, we can define custom actions that users can perform on messages within the chat.
