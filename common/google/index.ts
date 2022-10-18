import { getLogger } from 'log4js';
import { material } from '../mentoring/material';
import { google, calendar_v3 as googleCalendar } from 'googleapis';

const logger = getLogger();

export interface PeerToPeerCall {
    time?: string;
    link?: string;
    title?: string;
    description?: string;
}

const parsePlaylistItem = (item) => {
    return {
        title: item.snippet.title,
        description: item.snippet.description,
        id: item.snippet.resourceId.videoId,
    };
};

const parseFileData = (item) => {
    return {
        name: item.name,
        link: item.webViewLink,
    };
};

const parsePeerToPeerCall = (event: googleCalendar.Schema$Event): PeerToPeerCall => {
    const linkFromConferenceData = event.conferenceData?.entryPoints?.find((e) => e.entryPointType == 'video')?.uri;

    return {
        time: event.start.dateTime,
        link: linkFromConferenceData ?? event.location?.match(/https?:[^\s]+/)?.pop(),
        title: event.summary,
        description: event.description,
    };
};

function queryPlaylistItems(query) {
    return new Promise((resolve, reject) => {
        const service = google.youtube({ version: 'v3', auth: process.env.GOOGLE_KEY });
        service.playlistItems.list(query, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            if (!res.data.items) {
                resolve([]);
                return;
            }
            resolve(res.data.items);
        });
    });
}

function queryFiles(query) {
    return new Promise((resolve, reject) => {
        const service = google.drive({ version: 'v3', auth: process.env.GOOGLE_KEY });
        service.files.list(query, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            if (!res.data.files) {
                resolve([]);
                return;
            }
            resolve(res.data.files);
        });
    });
}

async function queryEvents(query: googleCalendar.Params$Resource$Events$List): Promise<googleCalendar.Schema$Event[]> {
    const calender: googleCalendar.Calendar = google.calendar({
        version: 'v3',
        auth: process.env.GOOGLE_KEY,
    });

    const result = await calender.events.list(query);

    return result.data.items;
}

export async function listVideos(playlistID: string) {
    let videos = [];
    await queryPlaylistItems({ part: 'snippet', playlistId: playlistID, maxResults: 50 })
        .then(JSON.stringify)
        .then(JSON.parse)
        .then((res) => (videos = res.map(parsePlaylistItem)))
        .catch((err) => logger.warn('YouBube playlistItems query failed: ' + err.message));

    return videos;
}

export async function listFiles(folderID: string) {
    let files = [];
    await queryFiles({ q: `'${folderID}' in parents`, pageSize: 1000, fields: '*', supportsTeamDrives: true, includeTeamDriveItems: true })
        .then(JSON.stringify)
        .then(JSON.parse)
        .then((res) => (files = res.map(parseFileData)))
        .catch((err) => logger.warn('Drive files query failed: ' + err.message));

    return files;
}

export async function getPeerToPeerCallDate(): Promise<PeerToPeerCall> {
    const events = await queryEvents({
        calendarId: material.call_calendar,
        maxResults: 1,
        orderBy: 'startTime',
        singleEvents: true,
        timeMin: new Date().toISOString(),
    });
    if (events.length === 0) {
        return {};
    }
    if (events.length === 1) {
        const peerToPeerCall = parsePeerToPeerCall(events[0]);

        if (!peerToPeerCall.link) {
            logger.warn('No valid link extracted from calendar event.');
        }

        return peerToPeerCall;
    }
    if (events.length > 1) {
        logger.warn('Calendar query returned more than one event.');
    }
}
