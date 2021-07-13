import { ResolversEnhanceMap } from "./generated";
import { Role } from "./roles";
import { Authorized } from "type-graphql";

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
