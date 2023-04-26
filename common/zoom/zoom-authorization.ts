const zoomOauthApiUrl = 'https://api.zoom.us/oauth/token';

const getAccessToken = async (apiKey: string, apiSecret: string, grantType: string, accountId: string) => {
    const response = await fetch(zoomOauthApiUrl, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            grant_type: grantType,
            account_id: accountId,
        }),
    });
    const data = await response.json();
    return data;
};

export { getAccessToken };
