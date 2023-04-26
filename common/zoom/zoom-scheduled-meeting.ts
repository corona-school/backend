async function createZoomMeeting(apiKey, apiSecret, meetingData) {
    const response = await fetch(`https://api.zoom.us/v2/users/me/meetings`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingData),
    });

    const data = await response.json();

    return data;
}

export { createZoomMeeting };
