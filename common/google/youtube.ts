import {getLogger} from "log4js";


const {google} = require('googleapis');
const logger = getLogger();

export function GetPlaylist(playlistID: string) {
    const service = google.youtube({version: 'v3', auth: process.env.GOOGLE_KEY});
    service.playlistItems.list({part: 'snippet', playlistId: playlistID}, function (err, response) {
        if (err) {
            logger.error("Loading Youtube playlist failed: " + err.message);
            logger.debug(err);
            return;
        }
        const videos = response.data.items;
        return videos.map(v => {title: v.snippet.title; description: v.snippet.description; id: v.ressourceId.videoId;});
    });
}