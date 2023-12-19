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
