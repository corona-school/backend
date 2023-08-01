# CHAT

## Overview

This project utilizes the [TalkJS API](https://talkjs.com/docs/) to provide an integrated chat functionality in our React app. TalkJS allows to facilitate real-time communication between users.

## 💬 Conversation IDs for 1:1 Chats and Group Chats

In this project, we use two different types of Conversation IDs to distinguish between 1:1 chats and group chats. The conversation IDs are essential for identifying and managing different chat sessions in the TalkJS API.

### 1:1 Chat Conversation IDs

For 1:1 chats, we create a unique Conversation ID dynamically using the SHA-1 hashing algorithm. This ID is not stored in the database since it can be easily generated on-the-fly based on the two participants' IDs. This approach ensures that 1:1 chats do not require explicit storage of Conversation IDs, reducing data redundancy.

### Group Chat Conversation IDs

On the other hand, for group chats, we generate random UUIDv4 Conversation IDs. UUIDv4 ensures that the generated IDs are globally unique and suitable for identifying group chat sessions. The group chat Conversation ID is always associated with a specific subcourse in our database.

## Ways to create a new chat

-   group chat for subcourses
-   one-on-one chat
    -   from match
    -   as prospect
    -   as participant
    -   as instructor
    -   from contact list

## 🔁 Chat Deactivation and Reactivation

The chats are only deacticated rather than deleting chats permanently. Chats are deactivated to allow for reactivation at a later stage if needed. We implement an automated process to deactivate chats using a cron job called `flagInactiveConversationsAsReadonly`. The deactivation occurs after 30 days when there is no longer a valid reason for the chat to remain active. The reasons for chat deactivation include:

-   **Match Dissolution**: If a match between chat participants was dissolved more than 30 days ago, the chat is no longer considered relevant and is deactivated.
-   **Subcourse Completion**: If the associated subcourse for the chat has ended more than 30 days ago, the chat serves no further purpose and is deactivated.

The 30-day period for deactivation allows participants to continue using the chat for the initial 30 days after its last relevant activity. Once deactivated, the chat becomes readonly for all participants, preventing any further modifications or interactions.

### Reactivation of Chats

Deactivated chats can be reactivated if necessary. When a participant accesses a deactivated chat, they will have the option to reactivate it, triggering the chat to become active again. This feature is particularly useful when users need to revisit previous conversations or re-engage with other participants.

### Automated Deactivation Process

To handle the automated deactivation process, we use a cron job that runs periodically (e.g., daily) and identifies chats that meet the deactivation criteria. The cron job then sets the chat acces to `none`, effectively deactivating them for all participants.

By adopting a chat deactivation approach rather than immediate deletion, we ensure that important conversations are not lost permanently and that participants can revisit and reactivate chats as needed within the defined 30-day window.

## 🎨 Customizing

In this project, we take advantage of TalkJS' customization features to create a tailored chat. TalkJS offers a Dashboard where we can customize the chat theme, along with various user settings, to enhance the overall chat functionality.

### Custom Chat Theme

With TalkJS Dashboard, we can easily create a custom chat theme to match our application's branding and design.

-   User Settings
    TalkJS Dashboard empowers us to configure various user settings, enabling us to offer a personalized chat experience for our users. Some of the key user settings we can adjust include:

-   File Upload
    We can enable or disable file uploads in the chat, allowing users to share files and media within conversations. This feature enhances communication by enabling the exchange of images, documents, and other types of files directly within the chat.

-   Voice Messages
    Voice messages add an extra layer of interactivity to the chat. We can enable voice messaging so that users can send audio messages to one another, fostering more engaging and efficient communication.

-   Profanity Filter
    To maintain a positive and respectful communication environment, we have the option to enable a profanity filter. The filter helps identify and moderate offensive language in chat messages, ensuring a safe and appropriate chat experience for all users. (REGEX)

-   Custom Message Actions
    TalkJS Dashboard provides a powerful feature called Custom Message Actions. With this feature, we can define custom actions that users can perform on specific types of messages within the chat. For instance, we can add actions like "Accept," "Decline," or "View Details" to messages containing invitations or proposals. Custom message actions enhance the chat's interactivity and facilitate specific actions without leaving the chat context.

## ⚡️ Metadata

We utilize custom metadata during the creation of chats to provide additional context and information. Depending on whether it's a group chat or a 1:1 chat, the custom metadata contains different properties.

### Group Chat Custom Metadata

For group chats, the custom metadata includes the following properties:

-   `start`: Represents the start date of the course associated with the group chat. It indicates the first session or event of the course.
-   `groupType`: Specifies the type of the group chat. It can be either "NORMAL" or "ANNOUNCEMENT".
-   `subcourse`: An array containing the IDs of the subcourses for which the group chat was created.
    In the case of an "announcement" group chat, only the instructor has read-write rights, while other participants have read rights.

### 1:1 Chat Custom Metadata

For 1:1 chats, the custom metadata includes the following properties:

-   `match`?: If the 1:1 chat is initiated based on a match, this property contains the ID of the match associated with the chat.
-   `subcourse`?: An array containing the IDs of the subcourses relevant to the 1:1 chat, depending on the context. For example, if the chat is about contacting a course instructor, it may contain the ID of the relevant subcourse. Similarly, if its about contacting a match partner, it may contain the ID of the relevant subcourse.
-   `prospectSubcourse`?: If the chat is initiated to contact a course participant for a specific subcourse of interest, this property contains the ID of that subcourse.
    The custom metadata allows us to add relevant information to each chat, providing essential context for the communication and enabling effective handling of different types of chats.

## ⚙️ System Messages

We send system messages to communicate important events and actions within chats.

-   First Messages: The "First" system message is sent when a new chat conversation is initiated. We use it to welcome users and provide any necessary instructions for using the chat.
-   Group Chat Type Changed: The "Group Changed" system message is sent when the type of a group chat is changed (from 'normal' to 'announcement', or other way round). It notifies participants about the changes and any updates related to the group chat.
-   Chat Deactivation (Over): The "Group Over" system message is sent when a group chat or a 1:1 chat is deactivated. It notifies users that the chat is no longer active and provides relevant information about the deactivation.
-   Chat Reactivation: The "Group Reactivate" and "1:1 Reactivate" system messages are sent when a deactivated chat is reactivated. These messages inform users that the chat is active again and can be used for communication.
