import { ActionID } from '../notification/actions';
import { User } from '../user';

// match, pool, openMatchRequestCount, screening, firstMatchRequest
type AchievementActionContext = {
    subcourse?: {
        lectures: {
            start: Date;
        }[];
    };
    appointment?: {
        id: number;
        duration?: number;
        match?: number;
        subcourse?: number;
    };
    // TODO: this is used for bucketing. We should probably to somewhere else.
    weeks?: number;
};

export type Event = {
    action: string;
    at: Date;
    user: User;
};

export function actionTaken<ID extends ActionID>(user: User, actionId: ID, context: AchievementActionContext) {
    // TODO: create Event
    const event: Event = {
        action: actionId,
        at: new Date(),
        user: user,
    };

    // TODO: track event
    // TODO: checkAwardAchievement

    return null;
}
