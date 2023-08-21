# Zoom

The Zoom integration is designed to automate the process of generating, updating, and managing Zoom meetings for appointments. It ensures that every appointment has a corresponding Zoom meeting, and it synchronizes changes in appointments with the associated Zoom meetings. Additionally, the integration handles ad-hoc meetings and various user-related functionalities.

## Key Features

### Automatic Zoom Meeting Generation

For each appointment created, a corresponding Zoom meeting is automatically generated. This ensures that there is a virtual meeting space available for every scheduled appointment.

### Real-time Updates

Any updates made to an appointment, such as changes in start time or duration, are automatically reflected in the associated Zoom meeting details. This synchronization prevents discrepancies between appointment information and Zoom meeting settings.

### Data Management

-   Meeting IDs are stored in the database, linking each appointment to its respective Zoom meeting.
-   Zoom meeting reports are saved in the database, providing a historical record of meetings.
-   Instructors are required to have Zoom licenses, while pupils do not need them.
-   Zoom licenses are revoked upon the deactivation of a student account.
-   Zoom meetings are deleted when appointments are canceled or matches are dissolved.

### Ad-Hoc Meetings

Students have the ability to initiate ad-hoc meetings with their match partners. An appointment is created with an immediate start time and a 30-minute duration. This process automatically generates a Zoom meeting for the ad-hoc session.

### Access Tokens

To facilitate Zoom API interactions, the system uses `generateMeetingSDKJWT` and `getAccessToken` functions to obtain the necessary access tokens for making authenticated requests.

### Component Overview

| File                   | function                                                                                           |
| ---------------------- | :------------------------------------------------------------------------------------------------- |
| `type.ts`              | Functions to create match or group appointment, function to create zoom meeting for appointments   |
| `authorization.ts`     | Function to get access token                                                                       |
| `retry.ts`             | Used to execute an asynchronous operation multiple times and automatically retry in case of errors |
| `scheduled-meeting.ts` | Functions create, get, delete zoom meeting, create meeting report                                  |
| `user.ts`              | Functions to create, get, update, delete a zoom user, get user ZAK, get zoom user infos            |
| `util.ts`              | Assure that zoom feature is active                                                                 |
