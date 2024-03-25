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

### Achievement context vs Action context
