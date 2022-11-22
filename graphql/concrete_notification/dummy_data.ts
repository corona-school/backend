import { ConcreteNotification, ConcreteNotificationState } from '../../common/entity/ConcreteNotification';

const ids = Array.from({ length: 10 }, (_, i) => i + 1);
const dummyMinutes = [0, 5, 10, 15, 20, 30, 60, 120, 150, 60 * 24, 60 * 48];

// Dummy dates indexed by dummy ids
export const getDummyCreatedAt = (id: number): Date => new Date(Date.now() - dummyMinutes[id] * 1000 * 60);

export const getDummyConcreteNotifications = (userId): ConcreteNotification[] =>
    ids.map(
        (id): ConcreteNotification => ({
            id,
            attachmentGroupId: '',
            context: {},
            notificationID: id,
            sentAt: new Date(),
            userId,
            state: ConcreteNotificationState.SENT,
        })
    );
