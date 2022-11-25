import { getLogger } from "log4js";
import { getManager } from "typeorm";
import { CourseAttendanceLog } from "../../../common/entity/CourseAttendanceLog";

const DELETE_AFTER = 7; // in days
const logger = getLogger();

export default async function execute() {
    const entityManager = getManager();
    await entityManager
        .createQueryBuilder(CourseAttendanceLog, 'courseAttendanceLog')
        .update()
        .where('courseAttendanceLog.createdAt < :date', { date: Date.now() - DELETE_AFTER })
        .set({ ip: "", pupil: { id: 0 } })
        .execute();

    logger.info(`Removed IP Address and PupilID from attendance logs, which are older then 7 days.`);
}
