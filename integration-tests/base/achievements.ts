import assert from 'assert';
import { achievement_template_for_enum } from '../../graphql/generated';

interface MockAchievementTemplate {
    id: number;
}

interface MochUserAchievement {
    id: number;
}

export async function createMockSequentialTemplate(metrics: string[]) {}

export async function createMockTieredTemplate(metrics: string[]) {}

export async function createMockStreakTemplate(metrics: string[]) {}
