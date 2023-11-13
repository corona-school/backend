import { getLogger } from '../logger/logger';
import { ActionID, SpecificNotificationContext } from '../notification/actions';
import { User } from '../user';
import { isAchievementExistingForAction } from './helper';

const logger = getLogger('Achievement');

export type ActionEvent = {
    action: string;
    at: Date;
    user: User;
};

export async function actionTaken<ID extends ActionID>(user: User, actionId: ID, context: SpecificNotificationContext<ID>) {
    const isAchievementAction = await isAchievementExistingForAction(actionId);
    if (!isAchievementAction) {
        logger.debug(`No achievement found for action '${actionId}'`);
        return;
    }

    // TODO: create Event
    const event: ActionEvent = {
        action: actionId,
        at: new Date(),
        user: user,
    };

    // TODO: track event(event)
    // TODO: checkAwardAchievement

    return null;
}
