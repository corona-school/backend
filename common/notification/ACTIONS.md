# Actions  

Actions are global events going into the notification system. For a number of actions, notifications can be created as an reaction to that event. Each notification can access data from the subset of the contexts of all actions, e.g. in the Mailjet Template (for example: `{user.fullName}`). 

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
}
```


The following actions are implemented with their additional context:

### student_registration_started

Triggered when the user registers.

```ts
{
    redirectTo: string;
}
```