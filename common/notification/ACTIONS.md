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
## Courses

### participant_subcourse_cancelled

*description* 

Inform participants that subcourse was cancelled 

*context*

```typescript
{
    courseName: string,
    firstLectureDate: string /* DD.MM.YYYY */,
    firstLectureTime: string /* HH:MM */
}
```

### instructor_course_reminder

*description* 

Two days before the course the instructors are reminded 

*context*

```typescript
{
    courseName: string,
    firstLectureDate: string /* DD.MM.YYYY */,
    firstLectureTime: string /* HH:MM */
}
```

it is on purpose that it says participant firstname for the instructor.... 


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

### tutee_matching_notify

*description*

Send mail to tutee to notify after matching

*context*

```typescript
{
    student: User,
    subjects: string,
    callURL: string
}
```

### tutor_matching_notify

*description*

Send mail to tutor to notify after matching

*context*

```typescript
{
    pupil: User,
    pupilGrade: string,
    subjects: string,
    callURL: string
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

