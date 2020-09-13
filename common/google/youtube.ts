import {getLogger} from "log4js";


const {google} = require('googleapis');
const logger = getLogger();

export async function QueryPlaylistItems(playlistID: string) {
    const service = google.youtube({version: 'v3', auth: process.env.GOOGLE_KEY});
    logger.info(playlistID);
    return await service.playlistItems.list({part: 'snippet', playlistId: playlistID, maxResults: 50}).then(res => {
        return Object
            .values(res.data.items)
            .map(v => ({
                title: v["snippet"]["title"],
                description: v["snippet"]["description"],
                id: v["snippet"]["resourceId"]["videoId"]
            }));
    });
}