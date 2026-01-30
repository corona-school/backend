# INTEGRATED CHAT

### Overview

This project utilizes the [TalkJS API](https://talkjs.com/docs/) to provide an integrated chat functionality in our React app. TalkJS allows to facilitate real-time communication between users.

### Components

| Components                                   | function                                                                                                                         |
| -------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| `contacts.ts`                                | Get all contacts that a user is allowed to contact                                                                               |
| `conversation.ts`                            | Functions to create chats, send system messages, mark conversations, update and delte conversations, add and remove participants |
| `helper.ts`                                  | Helper functions i.e. to create IDs, chat signature                                                                              |
| `localization.ts`                            | Translations for the system messages                                                                                             |
| `user.ts`                                    | Functions to get or create chat user                                                                                             |
| `jobs/periodic/flag-old-conversation`        | Cronjob to mark conversations without purpose as "readonly"                                                                      |
| `web/controllers/chatNotificationController` | Webhook for missed messages                                                                                                      |
| `chat/mutations.ts`                          | GraphQL endpoints to create Chats                                                                                                |

### 💬 Conversation IDs for 1:1 Chats and Group Chats

Two different types of Conversation IDs are used to distinguish between 1:1 chats and group chats. The conversation IDs are essential for identifying and managing different chat sessions in the TalkJS API.

| ID                              |                                                                                                                                    |
| ------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| **1:1 Chat Conversation IDs**   | unique Conversation IDs, not stored in the database since it can be easily generated on-the-fly based on the two participants' IDs |
| **Group Chat Conversation IDs** | random UUIDv4 Conversation IDs, globally unique, is always associated with a specific subcourse in our database                    |

### ⚡️ Metadata

We utilize custom metadata during the creation of chats to provide additional context and information. Depending on whether it's a group chat or a 1:1 chat, the custom metadata contains different properties. The metadata is necessary on the one hand to display correct data in the chat and on the other hand to get further information, e.g. to deactivate when the subcourse is over or the match has been dissolved.

**👥 Group Chat Custom Metadata**

-   `start`: indicates the first event of the course.
-   `groupType`: Specifies the type of the group chat. It can be either `NORMAL` or `ANNOUNCEMENT`.
-   `subcourse`: An array containing the IDs of the subcourses for which the group chat was created.
    In the case of an "announcement" group chat, only the instructor has readwrite rights, while other participants have read rights.

**👤 1:1 Chat Custom Metadata**

-   `match?`: contains the ID of the match associated with the chat.
-   `subcourse?`: An array containing the IDs of the subcourses relevant to the 1:1 chat, depending on the context. For example, if the chat is about contacting a course instructor, it may contain the ID of the relevant subcourse. Similarly, if its about contacting a match partner, it may contain the ID of the relevant subcourse.
-   `prospectSubcourse?`: If the chat is initiated to contact a course participant for a specific subcourse of interest, this property contains the ID of that subcourse.

### 🔁 Chat deactivation and reactivation

The chats are only deacticated rather than deleting chats permanently. Chats are deactivated to allow for reactivation at a later stage if needed. An automated process was implemented to deactivate chats using a cron job called `flagInactiveConversationsAsReadonly`. The deactivation occurs after 30 days when there is no longer a valid reason for the chat to remain active. The 30-day period for deactivation allows participants to continue using the chat for the initial 30 days after its last relevant activity. Once deactivated, the chat becomes access to `none` for all participants, preventing any further modifications or interactions.
The reasons for chat deactivation include:

-   **Match Dissolution**:
    -   If a match is dissolved due to personal issues, it becomes inactive immediately.
    -   If it is dissolved due to missing CoC, the chat remains active for 14 days.
    -   For all other reasons, the chat remains active for 7 days after dissolved before being deactivated.
-   **Subcourse Completion**: If the associated subcourse for the chat has ended more than 30 days ago, the chat serves no further purpose and is deactivated.

### ⚓️ Webhook for missed messages

The webhook's main purpose is to detect when a user misses a regular chat message (not system messages). When the webhook receives the `notification.trigger` action for a missed regular message, it generates a Lern-Fair notification. This notification is sent to the user in-app and via email to inform them about the missed message. By doing so, we ensure that users are promptly notified about any missed important communications within the chat.

### ⚙️ System Messages

System messages are send to communicate important events and actions within chats.

**Events:**

-   `First Messages`: The "First" system message is sent when a new chat conversation is initiated. We use it to welcome users and provide any necessary instructions for using the chat.
-   `Group Chat Type Changed`: The "Group Changed" system message is sent when the type of a group chat is changed (from 'normal' to 'announcement', or other way round). It notifies participants about the changes and any updates related to the group chat.
-   `Chat Deactivation`: The "Group Over" system message is sent when a group chat or a 1:1 chat is deactivated. It notifies users that the chat is no longer active and provides relevant information about the deactivation.
-   `Chat Reactivation`: The "Group Reactivate" and "1:1 Reactivate" system messages are sent when a deactivated chat is reactivated. These messages inform users that the chat is active again and can be used for communication.

### 🎨 Customizing

TalkJS customization features is used to create a tailored chat. TalkJS offers a Dashboard where we can customize the chat theme, along with various user settings, to enhance the overall chat functionality.

**Custom Chat Theme:** `lern-fair-theme`

**User Settings (examples)**

-   **File Upload**
-   **Voice Messages**
-   **Bad word filter**
    To maintain a positive and respectful communication environment, we have the option to enable a profanity filter. The filter helps identify and moderate offensive language in chat messages, ensuring a safe and appropriate chat experience for all users. (REGEX)
-   **Custom Message Actions**
    With this feature, we can define custom actions that users can perform on messages within the chat.
