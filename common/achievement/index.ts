import { ActionID } from '../notification/actions';
import { User } from '../user';
import { Context } from './types';

export type ActionEvent = {
    action: string;
    at: Date;
    user: User;
};

export function actionTaken<ID extends ActionID>(user: User, actionId: ID, context: Context) {
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
