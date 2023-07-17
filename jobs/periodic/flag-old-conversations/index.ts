import moment from 'moment';
import { getMatch, getSubcourse } from '../../../graphql/util';
import { getAllConversations, markConversationAsReadOnly } from '../../../common/chat';
import { getLogger } from '../../../common/logger/logger';
import { Lecture } from '../../../graphql/generated';

const logger = getLogger();

async function isActiveMatch(id: number): Promise<boolean> {
    const today = moment().endOf('day');
    const match = await getMatch(id);
    const dissolvedAtPlus30Days = moment(match.dissolvedAt).add(30, 'days');
    return !dissolvedAtPlus30Days.isBefore(today);
}

async function isActiveSubcourse(id: number): Promise<boolean> {
    const today = moment().endOf('day');
    const subcourse = await getSubcourse(id, true);
    const isSubcourseCancelled = subcourse.cancelled;

    if (isSubcourseCancelled) {
        return false;
    } else {
        const lastLecutre = subcourse.lecture.sort((a: Lecture, b: Lecture) => moment(a.start).milliseconds() - moment(b.start).milliseconds()).pop();
        const lastLecturePlus30Days = moment(lastLecutre.start).add(30, 'days');
        const is30DaysBeforeToday = lastLecturePlus30Days.isBefore(today);
        return !is30DaysBeforeToday;
    }
}

export default async function flagInactiveConversationsAsReadonly() {
    const conversations = await getAllConversations();
    const conversationIds: string[] = [];

    for (const conversation of conversations.data) {
        let shouldMarkAsReadonly: boolean;
        if (conversation.custom.subcourse) {
            const subcourseIds: number[] = JSON.parse(conversation.custom.subcourse);
            const allSubcoursesActive = await Promise.all(subcourseIds.map((id) => isActiveSubcourse(id)));
            shouldMarkAsReadonly = allSubcoursesActive.every((active) => active === false);
        }
        if (conversation.custom.prospectSubcourse) {
            const prospectSubcourses: number[] = conversation.custom.prospectSubcourse;
            const allProspectSubcoursesActive = await Promise.all(prospectSubcourses.map((id) => isActiveSubcourse(id)));
            shouldMarkAsReadonly = allProspectSubcoursesActive.every((active) => active === false);
        }

        if (conversation.custom.match) {
            const match = JSON.parse(conversation.custom.match);
            const matchId = match.matchId;
            const isMatchActive = await isActiveMatch(matchId);
            shouldMarkAsReadonly = !isMatchActive;
        }

        if (shouldMarkAsReadonly) {
            conversationIds.push(conversation.id);
        }
    }

    if (conversationIds.length > 0) {
        for (const id of conversationIds) {
            await markConversationAsReadOnly(id);
        }
        logger.info(`Mark conversations without purpose as readonly.`);
    } else {
        logger.info('No conversation to mark as readonly');
    }
}
