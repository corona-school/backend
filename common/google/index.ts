import {getLogger} from "log4js";

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
}

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
};

export async function listVideos(playlistID: string) {
    let videos = [];
    await queryPlaylistItems({ part: 'snippet', playlistId: playlistID })
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