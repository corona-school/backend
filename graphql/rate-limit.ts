import { getLogger } from "log4js";
import { createMethodDecorator } from "type-graphql";
import { GraphQLContext } from "./context";

const log = getLogger("GraphQL Rate Limiting");

export function RateLimit(name: string, max: number, interval: number /* in ms */) {
    const countPerIP = new Map<string, number>();

    setInterval(() => {
        countPerIP.clear();
        log.info(`Cleared Rate Limit ${name} counters`);
    }, interval);

    return createMethodDecorator<GraphQLContext>(({ args, root, info, context }, next) => {
        if (!countPerIP.has(context.ip)) {
            log.debug(`First request from ${context.ip}`);
            countPerIP.set(context.ip, 1);
            return next();
        }

        const count = countPerIP.get(context.ip);
        countPerIP.set(context.ip, count + 1);

        if (count > max) {
            log.warn(`Blocked ${context.ip} from accessing ${name} as maximum of ${max} was reached`);
            throw new Error(`RateLimit Enforcement`);
        }

        log.debug(`${context.ip} requested ${name} for the ${count}th time`);
        return next();
    });
}