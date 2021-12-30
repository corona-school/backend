import { configure } from "log4js";
import { isDev } from "./environment";

configure({
    appenders: {
        "stderr": { type: "stderr" },
        "stderr-filtered": { type: "logLevelFilter", appender: "stderr", level: (isDev ? "all" : "info") }
    },
    categories: {
        "default": {
            appenders: ["stderr-filtered"],
            level: "all"
        },
        "access": {
            appenders: ["stderr-filtered"],
            level: "all"
        }
    }
});

export { getLogger, connectLogger } from "log4js";