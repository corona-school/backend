# Appointments

The Appointment Feature is an extension of the existing system that allows students to schedule appointments for courses or individual meetings with a match partner. Appointments are stored in the existing `lecture` table in the database.

## Features

-   Create Course Appointments: Students can create course appointments to organize group meetings or course discussions.
-   Match Appointments: Students can also schedule individual appointments with a match partner.

### Components

| Components                                | function                                                                                         |
| ----------------------------------------- | :----------------------------------------------------------------------------------------------- |
| `cancel.ts`                               | Function to cancel an appointment as student                                                     |
| `create.ts`                               | Functions to create match or group appointment, function to create zoom meeting for appointments |
| `decline.ts`                              | Function to decline an appointment as pupil                                                      |
| `get.ts`                                  | Functions to get appointments (`appointment list``)                                              |
| `participants.ts`                         | Functions to handle participation of users on appointments                                       |
| `update.ts`                               | Function to update an appointment                                                                |
| `util.ts`                                 | Some util functions                                                                              |
| `jobs/migrate-lectures-to-appointment.ts` | migrate existing lectures to appointments                                                        |

### Appointment list

The frontend includes a dynamic appointment list. This list displays upcoming appointments.

-   Infinite Scroll with Cursor: To enable seamless navigation through future appointments, an infinite scroll mechanism has been implemented. A cursor is used to efficiently retrieve appointment data beyond the currently visible appointments.

### Query appointments

Endpoints:

-   appointment: query data from one appointment
-   user/appointments:
-   match/appointments
-   subcourse/appointments

### Create appointments

-   create match appointment/-s
-   create group appointment/-s: on course creation or new course appointment/-s

`addGroupAppointmentsOrganizer` on

-   `addSubcourseInstructor`

`addGroupAppointmentsParticipant` on

-   `subcourseJoin`
-   `subcourseJoinManual`
-   `subcourseJoinFromWaitinglist`

`removeGroupAppointmentsOrganizer` on

-   `subcourseDeleteInstructor`

`removeGroupAppointmentsParticipant` on

-   `subcourseLeave`

`cancelAppointments` on `cancelSubcourse`

### Notifications

| Notification                       | When?                                             |
| ---------------------------------- | :------------------------------------------------ |
| `student_add_appointment_group`    | if a student added an appointment for a course    |
| `student_add_appointments_group`   | if a student added many appointments for a course |
| `student_cancel_appointment_group` | if a student cancels a course appointment         |
| `student_cancel_appointment_match` | if a student cancels a match appointment          |
| `pupil_change_appointment_group`   | if data of an course appointment is updated       |
| `pupil_change_appointment_match`   | if data of an match appointment is updated        |
