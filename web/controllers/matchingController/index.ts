import { Response } from "express";
import { getLogger } from "log4js";
import { ApiMatchingOptions } from "./types/matching-options";
import { ApiMatchingRestrictions } from "./types/matching-restrictions";

import { validateRequestAndExecuteWithHandler } from "./middleware";
import { EntityManager, getManager } from "typeorm";
import { tutorsToMatch } from "../../../common/administration/match-making/tutoring/people/tutors";
import { tuteesToMatch } from "../../../common/administration/match-making/tutoring/people/tutees";

import { matchMakingWithPersons } from "../../../common/administration/match-making/tutoring";
import { tuteeMatchingRestrictionFilter, tutorMatchingRestrictionFilter } from "./utils/matching-restrictions/filtering";
import { ensureValidityOfMatchingRestrictionsAgainstDB } from "./utils/matching-restrictions/validity-checks";
import { filterWithMultipleFilters } from "./utils/arrays";
import { transformApiMatchingOptionsToInternal, transformInternalMatchMakingResultToApi } from "./utils/transforms";
import { classToPlain } from "class-transformer";

const logger = getLogger();




async function performMatchRequest(restrictions: ApiMatchingRestrictions, options: ApiMatchingOptions, manager: EntityManager) {
    // get all matchable students and pupils
    const matchableTutors = await tutorsToMatch(manager);
    const matchableTutees = await tuteesToMatch(manager);

    // filter students and pupils according to matching restrictions (if given, otherwise use all for matching)
    const tutorFilters = restrictions.tutorRestrictions?.map(r => tutorMatchingRestrictionFilter(r));
    const tuteeFilters = restrictions.tuteeRestrictions?.map(r => tuteeMatchingRestrictionFilter(r));

    const applicableTutors = filterWithMultipleFilters(matchableTutors, tutorFilters);
    const applicableTutees = filterWithMultipleFilters(matchableTutees, tuteeFilters);

    // execute matching algorithm with the filtered students and pupils and get a matching
    const result = await matchMakingWithPersons(applicableTutors, applicableTutees, transformApiMatchingOptionsToInternal(options), manager);

    //return output
    return transformInternalMatchMakingResultToApi(result);
}

async function matchPeopleHandler(
    matchingRestrictions: ApiMatchingRestrictions,
    matchingOptions: ApiMatchingOptions,
    res: Response) {

    const manager = getManager();

    // perform additional database related checks of the matching restrictions, i.e. are all given email addresses valid?
    try {
        await ensureValidityOfMatchingRestrictionsAgainstDB(matchingRestrictions, manager);
    }
    catch (e) {
        res.status(404).send(e.toString());
        return;
    }

    //perform actual matching with given restrictions and options
    try {
        const result = await performMatchRequest(matchingRestrictions, matchingOptions, manager);

        //create api return result
        const plainObj = classToPlain(result);

        //return with success
        res.status(200).send(plainObj);
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
}

export const matchPeopleMiddleware = validateRequestAndExecuteWithHandler(matchPeopleHandler);

