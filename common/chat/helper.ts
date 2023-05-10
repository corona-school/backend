const parseSlashToUnderscore = (userId: string): string => {
    return userId.replace('/', '_');
};

const parseUnderscoreToSlash = (id: string): string => {
    return id.replace('_', '/');
};

const checkResponseStatus = async (response: Response): Promise<void> => {
    if (response.status !== 200) {
        const errorMessage = await response.json();
        throw new Error(`Request failed, due to ${JSON.stringify(errorMessage)}`);
    }
};

export { parseSlashToUnderscore, parseUnderscoreToSlash, checkResponseStatus };
