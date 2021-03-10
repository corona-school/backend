import { EntityManager } from "typeorm";
import { Match } from "../../../../entity/Match";

export async function latestTutoringMatch(manager: EntityManager): Promise<Match> {
    return await manager.findOne(Match, {
        order: {
            createdAt: "DESC"
        }
    });
}
