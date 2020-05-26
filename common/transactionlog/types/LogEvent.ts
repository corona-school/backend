import LogType from "./LogType";
import EventData from "./EventData";

export default abstract class LogEvent {
    readonly logType: LogType;
    readonly user_id: string;
    readonly data: EventData;

    protected constructor(logType: LogType, user_id: string, data: EventData) {
        this.logType = logType;
        this.user_id = user_id;
        this.data = data;
    }
}
