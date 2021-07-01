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