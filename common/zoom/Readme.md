# Zoom

-   A zoom meeting is automatically generated for each appointment.
-   save meeting id in db
-   zoom meeting report saved in db
-   every instructor needs zoom license - not pupils
-   deletion of zoom license
-

.env
process.env.ZOOM_ACTIVE
process.env.ZOOM_MEETING_SDK_CLIENT_ID
process.env.ZOOM_MEETING_SDK_CLIENT_SECRET

generateMeetingSDKJWT
getAccessToken

### Components

| Components                  | function                                                                                         |
| --------------------------- | :----------------------------------------------------------------------------------------------- |
| `index.ts`                  | Function to cancel an appointment as student                                                     |
| `type.ts`                   | Functions to create match or group appointment, function to create zoom meeting for appointments |
| `zoom-authorization.ts`     | Function to decline an appointment as pupil                                                      |
| `zoom-retry.ts`             | Functions to get appointments (`appointment list``)                                              |
| `zoom-scheduled-meeting.ts` | Functions create, get, delete zoom meeting, create meeting report                                |
| `zoom-user.ts`              | Functions to create, get, update, delete a zoom user, get user ZAK, get zoom user infos          |
