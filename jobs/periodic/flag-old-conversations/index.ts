import moment from 'moment';
import { getMatch, getSubcourse } from '../../../graphql/util';
import { getAllConversations, markConversationAsReadOnly } from '../../../common/chat';
import { getLogger } from '../../../common/logger/logger';

const logger = getLogger();
enum ConversationType {
    SUBCOURSE = 'subcourse',
    PROSPECT_SUBCOURSE = 'prospectSubcourse',
    MATCH = 'match',
}

async function isActive(id: number, conversationType: ConversationType): Promise<boolean> {
    const today = moment().endOf('day');
    if (conversationType === 'match') {
        const match = await getMatch(id);
        const dissolvedAtPlus30Days = moment(match.dissolvedAt).add(30, 'days');
        return dissolvedAtPlus30Days < today;
    }

    if (conversationType === 'subcourse' || conversationType === 'prospectSubcourse') {
        const subcourse = await getSubcourse(id);
        // TODO what if subcourse is cancelled
        const isSubcourseCancelled = subcourse.cancelled;

        const lastLecutre = subcourse.lecture.sort((a, b) => moment(a.start).milliseconds() - moment(b.start).milliseconds()).pop();
        const lastLecturePlus30Days = moment(lastLecutre.start).add(30, 'days');

        return lastLecturePlus30Days < today;
    }
    return false;
}

export default async function flagInactiveConversationsAsReadonly() {
    const conversations = await getAllConversations();
    const conversationIds = conversations.data
        .map(async (conversation) => {
            let shouldMarkAsReadonly = false;

            if (conversation.custom.subcourse) {
                const subcourseIds: number[] = conversation.custom.subcourse;
                const allSubcoursesActive = subcourseIds.some((id) => isActive(id, ConversationType.SUBCOURSE));
                shouldMarkAsReadonly = !allSubcoursesActive;
            } else if (conversation.custom.prospectSubcourse) {
                const prospectSubcourses: number[] = conversation.custom.prospectSubcourse;
                const allProspectSubcoursesActive = prospectSubcourses.some((id) => isActive(id, ConversationType.PROSPECT_SUBCOURSE));
                shouldMarkAsReadonly = !allProspectSubcoursesActive;
            } else if (conversation.custom.match) {
                const matchId = conversation.custom.match.matchId;
                const isActiveConversation = await isActive(matchId, ConversationType.MATCH);
                shouldMarkAsReadonly = !isActiveConversation;
            }

            if (shouldMarkAsReadonly) {
                return conversation.id;
            }

            return null;
        })
        .reduce((acc, conversationId) => {
            if (!null) {
                acc.push(conversationId);
            }
            return acc;
        }, []);

    conversationIds.forEach((id) => markConversationAsReadOnly(id));

    logger.info(`Mark conversations without purpose as readonly.`);
}
