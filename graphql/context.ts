import type { PrismaClient } from "@prisma/client";
import type { Role } from "./authorizations";

export interface GraphQLContext {
    user: { roles: Role[] };
    prisma: PrismaClient;
}