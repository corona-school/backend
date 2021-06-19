import { getLogger } from "log4js";

const logger = getLogger();

export class CourseCache<V> {
    reloadInterval: number;
    updateIntervalID: NodeJS.Timeout;
    isUpdatingCache = false;
    data: Map<string, V>;
    cacheUpdater: (string) => Promise<V>;

    constructor(reloadInterval: number, cacheUpdater: (string) => Promise<V>) {
        this.data = new Map();
        this.reloadInterval = reloadInterval;
        this.updateIntervalID = setInterval(this.cacheUpdateRunner.bind(this), reloadInterval);
        this.cacheUpdater = cacheUpdater;
    }

    set(key: string, value: V) {
        this.data.set(key, value);
    }
    get(key: string): V {
        return this.data.get(key);
    }
    del(key: string) {
        this.data.delete(key);
    }

    stopAutoReload() {
        clearInterval(this.updateIntervalID);
    }


    private async updateCache() {
        const keys = Array.from(this.data.keys());

        await Promise.all(keys.map(async (k) => {
            const res = await this.cacheUpdater(k);
            if (!res) {
                this.del(k);
            } else {
                this.set(k, res);
            }
            logger.info(`Cache for key '${k}' updated...`);
        }));
    }

    private cacheUpdateRunner() {
        if (this.isUpdatingCache) {
            return; //skip, because in progress of updating...
        }
        this.isUpdatingCache = true;

        this.updateCache().then(() => this.isUpdatingCache = false)
            .catch(() => this.isUpdatingCache = false);
    }
}