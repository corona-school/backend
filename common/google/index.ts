import {getLogger} from "log4js";
import moment from "moment";
import {throws} from "assert";

const {google} = require('googleapis');
const logger = getLogger();


const parsePlaylistItem = (item) => {
    return ({
        title: item.snippet.title,
        description: item.snippet.description,
        id: item.snippet.resourceId.videoId
    });
};

const parseFileData = (item) => {
    return ({
        name: item.name,
        link: item.webViewLink
    });
};

const parseEvent = (event) => {
    return ({
        time: event.start.dateTime,
        link: event.summary.match(/https?:[^\s]+/)[0]
    });
};

function queryPlaylistItems(query) {
    return new Promise((resolve, reject) => {
        const service = google.youtube({version: 'v3', auth: process.env.GOOGLE_KEY});
        service.playlistItems.list(query, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            if (!res.data.items) {
                resolve ([]);
                return;
            }
            resolve(res.data.items);
        });
    });
}

function queryFiles(query) {
    return new Promise((resolve, reject) => {
        const service = google.drive({version: 'v3', auth: process.env.GOOGLE_KEY});
        service.files.list(query, (err, res) => {
            if (err){
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

function queryEvents(query) {
    return new Promise((resolve, reject) => {
        const service = google.calendar({version: 'v3', auth: process.env.GOOGLE_KEY});
        service.events.list(query, (err, res) => {
            if (err){
                reject(err);
                return;
            }
            if (!res.data.items){
                resolve([]);
                return;
            }
            resolve(res.data.items);
        });
    });
}

export async function listVideos(playlistID: string) {
    let videos = [];
    await queryPlaylistItems({ part: 'snippet', playlistId: playlistID, maxResults: 50 })
        .then(JSON.stringify).then(JSON.parse).then(res => videos = res.map(parsePlaylistItem))
        .catch(err => logger.warn("YouBube playlistItems query failed: " + err.message));

    return videos;
}

export async function listFiles(folderID: string) {
    let files = [];
    await queryFiles({q: `'${folderID}' in parents`, pageSize: 1000, fields: '*'})
        .then(JSON.stringify).then(JSON.parse).then(res => files = res.map(parseFileData))
        .catch(err => logger.warn("Drive files query failed: " + err.message));

    return files;
}

export async function getNextDueEvent(calendarID: string){
    let event = {};
    await queryEvents({calendarId: calendarID, maxResults: 1, orderBy: "startTime", singleEvents: true, timeMin: new Date().toISOString() })
        .then(JSON.stringify).then(JSON.parse).then(res => {
            if (res.length !== 1) {
                throw new Error("Calendar query returned no or more than one events.");
            } else {
                return res;
            }
        })
        .then(res => parseEvent(res[0]))
        .then(res => {
            if (!res.link){
                throw new Error("No valid link extracted from calendar event.");
            } else {
                event = res;
            }
        })
        .catch(err => logger.warn("Calendar query failed: " + err.message));

    return event;
}