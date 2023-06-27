-   chats will not be deleted -> deactivate if no purpose is there (e.g. match dissolved) => make the conversation readonly
-   chats will be deactivated automatically after 30 days if there is no purpose anymore
-   chats can be reactivated => make conversation writeable

# INTEGRATED CHAT

First, there are two types of conversations: `group chat` and `one-on-one chat`.

In addition, the group chat can again be distinguished between two types: `course` and `announcement`.
If a group chat is type of `announcement` then only the course instructor has the right to write into the chat. The other participants can read the messages, but dont write.
Group chat type `course` is the case, if participants are also allowed to write in the chat.

### Access right

-   ReadWrite
-   Read

## Concept of IDs

There are two kinds of conversationsIds that are used: oneOnOneId and subcourse.chatId

`oneOnOneID`
First the `oneOnOneId` for single conversation e.g. match conversations or a conversation between course instructor and course participant / prospect. The `oneOnOneId` is not stored in the database.

`subcourse.chatId`
The `subcourse.chatId` on the other hand is stored in the database, because we need the ID to join new participants, remove participants, or make it a read-only conversation (also the other way round).

## Contact Reasons

-   course
-   announcement
-   match
-   participant
-   prospect

## Metadata

Metadata is shared with the conversation to provide more information about the conversation. We also need the metadata to reactivate a chat later.

## TalkJS

-   Roles for pupil and student. (settings like file sharing)
-   Theme: lern-fair-theme
-   empty state
-
-   add new components (cant delete old components)
