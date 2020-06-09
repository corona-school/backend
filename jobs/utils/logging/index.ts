import { configure, getLogger as getLog4jsLogger } from "log4js";

export function setup() {
    try {
        configure("jobs/logconfig.json");
    } catch (e) {
        console.warn("Couldn't setup logger", e);
    }
}

export function getLogger() {
    return getLog4jsLogger();
}