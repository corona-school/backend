import {prisma} from "../../../common/prisma";
import moment from "moment";
import {getLogger} from "log4js";

const DELETE_AFTER = 30 * 3; // in days
const logger = getLogger();

export default async function execute() {

    const res = await prisma.concrete_notification.updateMany({
        where: {
            sentAt: {
                lte: moment().startOf("day")
                    .subtract(DELETE_AFTER, "days")
                    .toDate()
            }
        },
        data: {
            context: {}
        }
    });

    logger.info(`Deleted context of ${res.count} concrete notifications`);
}
