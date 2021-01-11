import { EntityManager } from "typeorm";
import { ProjectMatch } from "../../../../entity/ProjectMatch";

export async function latestProjectCoachingMatch(manager: EntityManager): Promise<ProjectMatch> {
    return await manager.findOne(ProjectMatch, {
        order: {
            createdAt: "DESC"
        }
    });
}
