export function getVersion(): string {
    return process.env.HEROKU_SLUG_COMMIT || 'latest';
}

export function getServiceName(): string {
    return process.env.SERVICE_NAME || 'n/a';
}

export function getEnvironment(): string {
    return process.env.ENV || 'dev';
}

export function getDDEnvironment(): string {
    return process.env.DD_ENV || 'dev';
}

export function getHostname(): string {
    return process.env.DD_HOSTNAME || 'n/a';
}

export function isGamificationFeatureActive(): boolean {
    return JSON.parse(process.env.GAMIFICATION_ACTIVE || 'false');
}

export function isWebflowSyncDryRun(): boolean {
    return JSON.parse(process.env.WEBFLOW_SYNC_DRY_RUN || 'true');
}

export function getLogLevel(defaultLevel: string): string {
    return process.env.LOG_LEVEL || defaultLevel;
}

export function getLogFormat(): string | null {
    return process.env.LOG_FORMAT;
}

export function isAchievementCleanupActive(): boolean {
    return JSON.parse(process.env.ACHIEVEMENT_CLEANUP_ACTIVE || 'false');
}
