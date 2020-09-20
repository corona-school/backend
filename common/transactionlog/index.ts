import { getConnection, Repository } from "typeorm";
import Log from "../entity/Log";
import LogEvent from "./types/LogEvent";

class TransactionLog {
    private logs: Repository<Log>;

    constructor() {
        this.logs = getConnection().getRepository(Log);
    }

    async log(logEvent: LogEvent) {
        const log = new Log();
        log.logtype = logEvent.logType;
        log.user = logEvent.userId;
        log.data = JSON.stringify(logEvent.data);

        await this.logs.save(log);
    }
}

let transactionLog: TransactionLog | undefined = undefined;

export function getTransactionLog(): TransactionLog {
    if (transactionLog == undefined) {
        transactionLog = new TransactionLog();
    }
    return transactionLog;
}

/// This function will invalidate the current transactionLog singleton such that a new call to getTransactionLog() will return a new transaction log (i.e. associated with a new database connection pool!!!!)
export function invalidateActiveTransactionLog() {
    transactionLog = undefined;
}
