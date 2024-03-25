# Gamification / Achievements

> By integrating game-like elements and reward systems, gamification motivates users to actively participate in the learning process and maintain their engagement. By turning learning objectives into challenging tasks and offering rewards for milestones achieved, we incentivize and increase users' intrinsic motivation. This playful approach to learning creates a positive learning environment and increases the effectiveness and fun factor of the educational process in our app.

The achievement system is the heart of our gamification efforts.
It's responsible for tracking user-behaviour as well as evaluating if a user should be rewarded for this.

IIn the following sections we'll go into details about how the system works and what technical traits we had to take.
n the following sections we'll go into details about how the system works and what technical trade-offs we had to take.

Table of contents

1. [How does it work?](#how-does-it-work?)

## How does it work?

The following ER-Diagram shows how the different elements work together.
Each will be descibed in detail afterwards.

```mermaid
---
title: Achievement System
---
erDiagram
    Action }|--o{ Metric : creates
    Metric ||--o| Event : writes
    Metric }|--o{ Achievement_Template: has
    Achievement_Template ||--o{ User_Achievements: "create from"
    Event }|--|{ User_Achievements: uses
    User ||--o{ User_Achievements: has
```

[Here](https://mermaid.js.org/syntax/entityRelationshipDiagram.html#relationship-syntax) you can find more information about the relation syntax.

-   **Action** \
    The action triggered by the user.
    These will be called from variaous sources throughout the code.
    The idea is that then different systems can react to these actions an execute notifications / reward the user / etc.
    You can find all possible actions in [common/notification/actions.ts](common/notification/actions.ts).
-   **Metic** \
    A metric is an abstraction over actions that is responsible to extract information from an action.
    The idea is that we can map an action to a value, that can be used for evaluation later on.
    Examples might be basic tracking, where one action call will related to a metric of value 1.
    Another example could be tracking the time a user spent in zoom meetings. Therefore, we would only have one action, but the metric value would equal to the time spent in the meeting.
    You can find all possible metrics in [common/achievement/metric.ts](common/achievement/metric.ts).
-   **Achievement Template** \
    Sometimes, there are achievements that should be generated based on matches / course, like "create new course".
    To support this behaviour, we've introduced the abstraction of achievement templates.
    The templates contain all metadata like titles, description, etc. as well as all the information that is needed for evaluation.
-   **User Achievement** \
    The specific achievement that is assigned to a user.
    It's always based on a single achievemnt template and extends it with a context, relation and record value.
    These are needed for proper evaluation and displaying of the achievement.

### Achievement types

There are 3 different achievement types that can be issued as rewards to a user. The system differs between Streak Achievements, Tiered Achievements and Sequential Achievements.

#### Streak Achievements

Streak achievements are an integral part of our rewards system, designed to motivate users to maintain consistent engagement with our platform.
In our rewards system, a streak represents a consecutive series of desired actions performed by a user within a defined timeframe.
These actions could include logging into the platform, completing tasks, or achieving specific milestones.

Streaks serve as a means to encourage users to sustain their engagement over time.
The system tracks users' actions and counts streaks based on the consecutive days or instances in which the desired action is performed.

For example, if a user logs into the platform daily for five consecutive days, they would have a streak of five days.

#### Tiered Achievements

In our rewards system, tiered achievements consist of predefined milestones that users can reach by performing specific actions.
These actions could include participating in meetings, completing tasks, or reaching certain levels of engagement on our platform.

Tiered achievements are structured in a hierarchical manner, with each tier representing a higher level of accomplishment. For example:

-   Tier 1: 1 meeting joined
-   Tier 2: 3 meetings joined
-   Tier 3: 5 meetings joined
-   Tier 4: 10 meetings joined
-   ...

As users perform the specified actions and reach each milestone, they unlock the corresponding tiered achievement.

#### Sequential Achievements

Sequential achievements are a unique type of reward in our system, issued to users who successfully complete a series of predefined actions in a sequential manner.
These actions are typically milestones in a user journey, such as registering on our platform:

1. Register on the platform
2. Verify email address
3. Absolve screening process
4. Hand in certificate of conduct

Upon completing all the actions in the specified order, the user is rewarded with the sequential achievement.

#### One-Time

As of now, there is no "one-time" achievement, as we didn't need it.
If there is a specific use-case in the future, it should be added to the system.

Nevertheless, if you want to have a similar behaviour, you can use a `tiered` achievement with a valueToAchieve of 0.

### Groups

Tiered and especially sequential achievements rely on the fact that they are done in order.
Therefore, we've introduced the notion of groups in combination of group order, that every achievement template has to define.

If an user achievement was achieved, we'll use the group to figure out which template should be used to generate the next user achievement in order.
Therefore, these groups should be unique as well as every group order within a group.

### Achievement relation / context

Sometimes, there are achievements that should be generated based on matches / course, like "create new course".
To support this behaviour, we've introduced the abstraction of achievement templates.

In order to identify for which course / match an user achievement was created later on, we've added a `relation` field to it.
This relation is used during evaluation to figure out which metrics/events should be used.

Besides that, we are also interested in showing dynamic inforumation in the user-app, like the match partner's name or the course name.
Thereofre, we've added another field `context` to the user achievement, that stores such information, that can be used in the template's metadata fields.

### How it works

The following flow chart is giving a rough overview of how the achievement system is working.
Everything shown below is done in [common/achievement/index.ts](common/achievement/index.ts)

```mermaid
flowchart TD
    action([Action Taken]) --> searchMetrics["Get metrics by action"]
    searchMetrics --> searchAchievements["Seach achievements that use\n at least one of the metrics"]
    searchAchievements --> hasAchievements{{"Found at least one?"}}
    hasAchievements -- No --> nothing(["Do nothing"])
    hasAchievements -- Yes --> trackEvent["Track event"]
    trackEvent -- For each metric --> trackEvent
    trackEvent --> group["Group & sort achievements by group"]

    subgraph evaluate
        search["Seach active user achievement"] --> found{{"Found?"}}
        found -- No --> create["Create user achievement"]
        create --> runEval
        found -- Yes --> runEval["Run evaluation"]
        runEval --> success{{"Is Achieved?"}}
        success -- No --> done(["Done"])
        success -- Yes --> reward["Reward User"]
        reward --> hasNext["Has follow-up achievement?"]
        hasNext -- No --> done
        hasNext -- Yes --> createNext["Create next achievement"]
        createNext --> done
    end

    group -- For each group --> evaluate
    evaluate --> allDone(["Done"])
```

## How to create a new achievement

## Technical details

### Evaluation

### Achievement context vs Action context

The context is responsible for storing information that will be used for templating of the text fields of an achievement.
In order to have this information available during the creation of an achievement we've added it to each event, like

```ts
export type ActionEvent<ID extends ActionID> = {
    actionId: ActionID;
    at: Date;
    user: User;
    context: SpecificNotificationContext<ID>;
};
```

This means that we'll always use the context of the triggering event for a new achievement, which is not a problem itself.
Based on this, one could assume that it's easy to guess which data is available in an achievements context, by looking at the triggering events and their specific context in [common/notification/actions.ts](common/notification/actions.ts).

Unfortunately, this assumption is wrong and might be misleading.
If you have a look at the "How it works" flow chart above, you'll notice that if an achievement was achieved, we'll automatically create the next in the row.
This means, that even if `achievement B` is only caring about `event B`, it will be created with the context of `event A`. Furthermore, `achievement C`, will be created with the context of `event B` and so on.

This makes it hard to validate an achievement's context or show available attributes in Retool.

### Achievement relation vs event relation

The relation is generally used to relate events to specific buckets.
Nevertheless, vven tho both terms are similar, they are behaving differently.
Maybe `achievement scope` would have been a better way, but it's harder to change now.

The event relation is a hard relation to a specific entity, mostly lectures.
If the event doesn't have a relation, it will just be `null` and counts as global.

Achievement relation, on the other hand, is based on the template's `templateFor` setting.
There are multiple possibilities that control the result of the relation:

1. **Global** \
   Relation will always be null, as it should take all events into account.
2. **Global_Matches** \
   Relation will just be `match` and means that it will take all matches, but no courses and nothing else into account.
3. **Global_Courses** \
   Same as `Global_Matches` but with courses.
4. **Match** \
   Relation will be `match/<match_id>` and means that only events of a specific match will be taken into account.
5. **Course** \
   Same as `Match` but with a specific course. `course/<course_id>`

### Achievement images

In general, achievement images are uploaded to digitial ocean spaces below the following path `gamification/achievements/<achievement_id>`.
You can see all available images by running the following command:

```sh
 aws --profile lf s3 --endpoint https://fra1.digitaloceanspaces.com ls s3://backend-files/gamification/achievements/ --recursive
```

Note that you'll have to configure your aws cli accordingly before.

For the first release, where we haven't had the retool interface yet, we've uploaded the images to `gamification/achievements/release/`, so that we haven't had to care about the ID yet.
This was done via:

```sh
aws --profile lf s3 --endpoint https://fra1.digitaloceanspaces.com cp ./ s3://backend-files/gamification/achievements/release/ --recursive --acl public-read
```

Note: it's important to configure the ACL to public-read. Otherwise, it wouldn't be possible to view them by our users.

#### Special case: course achievements

Course related achievements (relation course/<course_id>) are a special case here.
Instead of using the provided image, they'll always require to use the course image, so that it's easier to distinguish them over time.

## Design decisions

In the following paragraph, you can find some of the intentional, but yet important design decision that we took in the beginning.

### Buckets vs. negative events

### Ghost achievements

### Event tracking

## Limitations

### Dynamic result evaluation

In many cases you might be interested to compare the event aggregation to another value gathered from the DB.
A prominent example would be the "Kurs Beenden" achievement, which says that you've attended all lectures of a course.

In theory, you would count the number of attended lectures of a user and compare it to the total number of lectures.
Unfortunately, this is not possible in our current setup, as the algorithm is only able to aggregate metrics and compare these results at the moment.

In order to achieve something similar, we would have to provide a way to provide more infomration to the evaluation function.

### Synced achievement context

### Achievement context validation
