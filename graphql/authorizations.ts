import { ResolversEnhanceMap } from "./generated";
import { Authorized } from "type-graphql";

import { AuthChecker } from "type-graphql";
import { GraphQLContext } from "./context";
import assert from "assert";

export enum Role {
    /* Access via Retool */
    ADMIN = "ADMIN"
}

export const authChecker: AuthChecker<GraphQLContext> = ({ context }, requiredRoles) => {
    assert(requiredRoles.length, "Roles must be passed to AUTHORIZED");
    assert(requiredRoles.every(role => role in Role), "Roles must be of enum Role");

    if (!context.user || !context.user.roles)
        return false;

    return requiredRoles.some(requiredRole => context.user.roles.includes(requiredRole as Role));
};

const allAdmin = { _all: [Authorized(Role.ADMIN)] };

export const authorizationEnhanceMap: ResolversEnhanceMap = {
    Course: allAdmin,
    Pupil: allAdmin,
    Match: allAdmin,
    Lecture: allAdmin,
    Log: allAdmin,
    Subcourse: allAdmin,
    Student: allAdmin,
    Screening: allAdmin,
    Screener: allAdmin
};
