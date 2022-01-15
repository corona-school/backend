# Actions  

Actions are global events going into the notification system. For a number of actions, notifications can be created as an reaction to that event. Each notification can access data from the subset of the contexts of all actions, e.g. in the Mailjet Template (for example: `{{var:user.fullName}}`). The `?` signifies optional properties, those should be guarded by providing a default value like `{{var:user.university:"Keine Universität angegeben"}}`. 

 In each action, the following context is always available:

```ts
{
    user: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        firstname: string;
        lastname: string;
        fullName: string;
        active: boolean;
        email: string;
        verification: string;
        verifiedAt: Date;
        registrationSource: RegistrationSource;
        /* For actions prefixed with pupiL_ additionally these properties are set: */
        state: State;
        schooltype: SchoolType;
        grade: string;
        openMatchRequestCount: number;
        isParticipant: boolean;
        isProjectCoachee: boolean;
        school: School;
        teacherEmailAddress: string;
        /* For actions prefixed with student_ additionally these properties are set: */
        phone: string;
        isInstructor: boolean;
        state: State;
        university?: string;
        moduleHours: number;
        isProjectCoach: boolean;
        isUniversityStudent: boolean;
        openProjectMatchRequestCount: number;
        supportsInDaZ?: boolean;
    }
    
    /* Legacy way to build up links to the frontend,
       in the future, these should be concrete URLs instead (dashboardURL etc.)
       to make the Emails independent to frontend changes */
    authToken: string;
}
```


The following actions are implemented with their additional context:

## Onboarding

### student_registration_started

*description* 

Triggered when the user registers as a student.

*context*

```ts
{
    redirectTo?: string;
}
```

### pupil_registration_started

*description* 

Triggered when the user registers as a pupil.

*context*

```ts
{
    redirectTo?: string;
}
```

### mentor_registration_started

*description* 

Triggered when the user registers as a Mentor.

*context*

```ts
{
    redirectTo?: string;
}
```

### cooperation_tutee_registration_started

*description* 

Triggered when the user registers as a cooperation tutee.

*context*

```ts
{
    redirectTo?: string;
}
```

### user_registration_verified_email

*description*

The user has verified their email after registration. 
Pupils can now visit the platform, students are invited for screening.

### pupil_registration_finished

*description*

The pupil successfully registered and verified their email. 

## Screening

### tutor_screening_invitation

*description*

A future tutor was invited for screening.

### tutor_screening_success

*description*

A future tutor was accepted during screening.

### tutor_screening_rejection

*description*

A tutor was rejected during screening.


### instructor_screening_invitation

*description*

A future instructor was invited for screening.

### instructor_screening_success

*description*

A future course instructor was accepted during screening.

### instructor_screening_rejection

*description*

A course instructor was rejected during screening.


### coach_screening_invitation

*description*

A future coach was invited for screening.

### coach_screening_success

*description*

A future coach was accepted during screening.

### coach_screening_rejection

*description*

A coach was rejected during screening.

### user_authenticate

*description*

Triggered when the user tries to login or support triggers this Notification.
The user should be able to log in with the provided `secretToken`.

*context*

```ts
{ secretToken: string; }
```

## Courses

### participant_course_join

*description*

Participant joined the course

```typescript
{
    course: Course,
    subcourse: Subcourse
}
```

### participant_course_waiting_list_join

*description*

Future Participant joined the waiting list

```typescript
{
    course: Course,
    subcourse: Subcourse
}
```

### participant_course_cancelled

*description* 

Inform participants that subcourse was cancelled 

*context*

```typescript
{
    course: Course,
    subcourse: Subcourse,
    firstLectureDate: string /* DD.MM.YYYY */,
    firstLectureTime: string /* HH:MM */
}
```

### participant_course_leave

*description*

Participant left the course

```typescript
{
    course: Course,
    subcourse: Subcourse
}
```


### participant_course_waiting_list_leave

*description*

Participant left the waiting list

```typescript
{
    course: Course,
    subcourse: Subcourse
}
```

### participant_course_message

*description*

An instructor sent a message to all participants

*context*

```typescript
{
    instructor: User,
    course: Course,
    subcourse: Subcourse,
    subject: string,
    body: string
}
```

### participant_course_reminder

*description*

Two days before the course the participants are reminded

*context*

```typescript
{
    course: Course,
    subcourse: Subcourse,
}
```

### instructor_course_created

*description*

The instructor created a new subcourse.

*context*

```typescript
{
    course: Course,
    subcourse: Subcourse,
    firstLectureDate: string /* DD.MM.YYYY */,
    firstLectureTime: string /* HH:MM */
}
```

### instructor_course_cancelled

*description*

The instructor cancelled a subcourse.

*context*

```typescript
{
    course: Course,
    subcourse: Subcourse
}
```

### instructor_course_published

*description*

The instructor published a subcourse and pupils can join from now on.

*context*

```typescript
{
    course: Course,
    subcourse: Subcourse
}
```

### instructor_course_reminder

*description* 

Two days before the course the instructors are reminded 

*context*

```typescript
{
    course: Course,
    subcourse: Subcourse,
    firstLectureDate: string /* DD.MM.YYYY */,
    firstLectureTime: string /* HH:MM */
}
```

### instructor_course_participant_message

*description*

A participant sent a message to the correspondent

```typescript
{
    participant: User,
    course: Course,
    subcourse: Subcourse,
    subject: string,
    body: string
}
```




## Project Coaching

### coach_project_match_dissolved

*description* 

Notifies the (remaining) coach that the project match has been dissolved. 

*context*

```typescript
{
    coachee: User;
}
```
### coachee_project_match_dissolved

*description* 

Notifies the (remaining) coachee that the project match has been dissolved.

*context*

```typescript
{
    coach: User;
}
```


### coachee_project_match_success

*description*

Send mail to coachee to notify after matching

*context*

```typescript
{
    coach: User,
    subjects: string,
    callURL: string
}
```

### coach_project_match_success

*description*

Send mail to coach to notify after matching

*context*

```typescript
{
    coachee: User,
   	coacheeGrade: string,
    subjects: string,
    callURL: string
}
```

## Certificates

### pupil_certificate_approval

*description*

Send mail to pupil to approve certificate

*context*

```typescript
{
     certificateLink: string,
     student: User
}
```

### student_certificate_sign

*description*

Send mail to student to sign certificate

*context*

```typescript
{
     certificateLink: string,
     pupil: User
}
```

## Tutoring

### tutee_match_dissolved

*description*

Match was dissolved.

*context*

```typescript
{
    student: Student;
    matchHash: string;
    matchDate: number as string;
}
```

### tutee_match_dissolved_other

*description*

Match was dissolved by Pupil.

*context*

```typescript
{
    student: Student;
}
```


### tutor_match_dissolved

*description*

Match was dissolved.

*context*

```typescript
{
    pupil: Pupil;
    matchHash: string;
    matchDate: number as string;
}
```

### tutor_match_dissolved_other

*description*

Match was dissolved by Pupil. 

*context*

```typescript
{
    pupil: Pupil;
}
```


### tutee_matching_success

*description*

Send mail to tutee to notify after matching

*context*

```typescript
{
    student: User,
    subjects: string,
    callURL: string,
    matchHash: string,
    matchDate: number as string
}
```

### tutor_matching_success

*description*

Send mail to tutor to notify after matching

*context*

```typescript
{
    pupil: User,
    pupilGrade: string,
    subjects: string,
    callURL: string,
    matchHash: string,
    matchDate: number as string
}
```

### tutee_matching_confirm_interest

*description* 

Ask pupil if he is interested in the match for tutoring 

*context*

```typescript
{
    confirmationURL: string,
    refusalURL: string
}
```

## Feedback

### feedback_request_student

*description* 

Ask student for feedback

*context*

```typescript
{
    pupil: User
}
```

### feedback_request_pupil

*description* 

Ask pupil for feedback 

*context*

```typescript
{
    student: User
}
```

## Various

### user_login_email

*description* 

The user tries to log in, a link is supposed to be sent to him for login to the dashboard. 

*context*

```typescript
{
    dashboardURL: string
}
```

