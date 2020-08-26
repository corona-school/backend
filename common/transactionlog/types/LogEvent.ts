import LogType from "./LogType";
import EventData from "./EventData";

export default abstract class LogEvent {
    readonly logType: LogType;
    readonly userId: string;
    readonly data: EventData;

    protected constructor(logType: LogType, userId: string, data: EventData) {
        this.logType = logType;
        this.userId = userId;
        this.data = data;
    }
}
