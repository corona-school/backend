import { isAchievementCleanupActive } from '../../../utils/environment';
import { deleteUnreachableCourseAchievements } from './courses';

export default async function deleteUnreachableAchievements() {
    const isDryRun = !isAchievementCleanupActive();
    await deleteUnreachableCourseAchievements(isDryRun);
}
