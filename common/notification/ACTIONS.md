# Actions  

Actions are global events going into the notification system. For a number of actions, notifications can be created as an reaction to that event. Each notification can access data from the subset of the contexts of all actions, e.g. in the Mailjet Template (for example: `{{var:user.fullName}}`). The `?` signifies optional properties, those should be guarded by providing a default value like `{{var:user.university:"Keine Universität angegeben"}}`. 

 In each action, the following context is always available:

```ts
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
```


The following actions are implemented with their additional context:

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

### student_match_follow_up

*description* 

Reminder send seven days after initial match 

*context*

```ts
{
    pupil: pupil;
}
```

### pupil_match_follow_up

*description* 

Reminder send seven days after initial match 

*context*

```ts
{
    student: student;
}
```

### subcourse_participant_cancelled

*description* 

Inform participants that subcourse was cancelled 

*context*

```typescript
{
    participantFirstname: string,
    courseName: string,
    firstLectureDate: date,
    firstLectureTime: date
}
```

### course_instructor_reminder

*description* 

Two days before the course the instructors are reminded 

*context*

```typescript
{
    participantFirstname: string,
    courseName: string,
    firstLectureDate: date,
    firstLectureTime: date
}
```

it is on purpose that it says participant firstname for the instructor.... 

### course_participant_reminder

*description* 

Two days before the course the participants are reminded 

*context*

```typescript
{
    participantFirstname: string,
    courseName: string,
    firstLectureDate: date,
    firstLectureTime: date
}
```
### coach_project_match_dissolved

*description* 

Notifies the (remaining) coach that the project match has been dissolved. 

*context*

```typescript
{
    coachFirstname: to.firstname,
    coacheeFirstname: dissolver.firstname
}
```
### coachee_project_match_dissolved

*description* 

Notifies the (remaining) coachee that the project match has been dissolved.

*context*

```typescript
{
    coachFirstname: to.firstname,
    coacheeFirstname: dissolver.firstname
}
```



### certificate_pupil_approval

*description*

Send mail to pupil to approve certificate

*context*

```typescript
{
     certificateLink: string,
     student: student
}
```

### certificate_student_sign

*description*

Send mail to student to sign certificate

*context*

```typescript
{
     certificateLink: string,
     pupil: pupil
}
```

### coachee_matching_notify

*description*

Send mail to coachee to notify after matching

*context*

```typescript
{
    coach: coach,
    subjects: projectFieldsString,
    callURL: callURL
}
```

### coach_matching_notify

*description*

Send mail to coach to notify after matching

*context*

```typescript
{
    coachee: coachee,
    coacheeGrade: coachee.gradeAsNumber() != null ? `${coachee.gradeAsNumber()}. Klasse` : "hat die Schule bereits abgeschlossen",
   	subjects: projectFieldsString,
    callURL: callURL
}
```

### tutee_matching_notify

*description*

Send mail to tutee to notify after matching

*context*

```typescript
{
    pupilFirstname: tutee.firstname,
    studentFirstname: tutor.firstname,
    studentEmail: tutor.email,
    subjects: subjectsString,
    callURL: callURL
}
```

### tutor_matching_notify

*description*

Send mail to tutor to notify after matching

*context*

```typescript
{
    pupilFirstname: tutee.firstname,
    personFirstname: tutor.firstname,
    pupilEmail: tutee.email,
    pupilGrade: `${tutee.gradeAsNumber()}. Klasse`,
    subjects: subjectsString,
    callURL: callURL
}
```

### tutoring_pupil_confirmation_request

*description* 

Ask pupil if he is interested in the match for tutoring 

*context*

```typescript
{
    confirmationURL: confirmationRequest.confirmationURL(),
    refusalURL: confirmationRequest.refusalURL()
}
```

### tutoring_pupil_confirmation_request_reminder

*description* 

Remind pupil to confirm interest in tutoring 

*context*

```typescript
{
    confirmationURL: confirmationRequest.confirmationURL(),
    refusalURL: confirmationRequest.refusalURL()
}
```

### feedback_request_student

*description* 

Ask student for feedback

*context*

```typescript
{
    studentFirstName: student.firstname,
    pupilFirstName: pupil.firstname
}
```

### feedback_request_student

*description* 

Ask pupil for feedback 

*context*

```typescript
{
    studentFirstName: student.firstname,
    pupilFirstName: pupil.firstname
}
```

### 