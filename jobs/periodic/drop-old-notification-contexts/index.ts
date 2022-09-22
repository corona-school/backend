import {prisma} from "../../../common/prisma";
import moment from "moment";
import {getLogger} from "log4js";
import {ConcreteNotificationState} from "../../../common/notification/types";

const DELETE_AFTER = 30 * 3; // in days
const logger = getLogger();

export default async function execute() {

    const res = await prisma.concrete_notification.updateMany({
        where: {
            sentAt: {
                lte: moment().startOf("day")
                    .subtract(DELETE_AFTER, "days")
                    .toDate()
            },
            state: {
                in: [
                    ConcreteNotificationState.ACTION_TAKEN,
                    ConcreteNotificationState.SENT,
                    ConcreteNotificationState.ERROR
                ]
            }
        },
        data: {
            context: {},
            state: ConcreteNotificationState.ARCHIVED
        }
    });

    logger.info(`Deleted context of ${res.count} concrete notifications`);
}
