import {getLogger} from "log4js";
import {throws} from "assert";


const {google} = require('googleapis');
const logger = getLogger();

export async function QueryPlaylistItems(playlistID: string) {
    const service = google.youtube({version: 'v3', auth: process.env.GOOGLE_KEY});
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

export async function QueryFolderContent(folderID: string) {
    const service = google.drive({version: 'v3', auth: process.env.GOOGLE_KEY});

    const GetWebLink = async (fileID: string) => {
        return await service.files.get({fileId: fileID, fields: 'webViewLink'}).then(res => res.data.webViewLink);
    };

    return await service.files.list({q: `'${folderID}' in parents`, pageSize: 1000}).then(res => {
        return Object.values(res.data.files).map(f => ({name: f["name"], link: GetWebLink(f["id"])}));
    });
}