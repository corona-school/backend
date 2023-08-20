export function isChatFeatureActive(): boolean {
    return JSON.parse(process.env.CHAT_ACTIVE || 'false');
}

export function assureChatFeatureActive() {
    if (!isChatFeatureActive()) {
        throw new Error(`The integrated chat is deactivated`);
    }
}
