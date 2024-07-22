import { school_state_enum as State, pupil_schooltype_enum as SchoolType } from '@prisma/client';
import { getLogger } from '../logger/logger';
import { SchoolTypeMap } from './schoolType';

export interface ExternalSchool {
    id: string;
    name: string;
    city?: string;
    school_type?: string;
    zip?: string;
    email?: string;
}

export interface SchoolResult extends Omit<ExternalSchool, 'school_type'> {
    schooltype?: SchoolType;
    state: State;
}

const logger = getLogger('Jedeschule');

const getStateFromExternalSchool = (school?: ExternalSchool) => {
    const state = school?.id.substring(0, 2).toLowerCase();
    const isValid = Object.values(State).includes(state as State);
    if (!isValid) {
        /**
         * The state is always the first part of the school id, if for some reason the state doesn't match
         * we need the heads up about that.
         */
        const msg = 'Could not get state from school';
        logger.error(msg, new Error(msg), school);
        return;
    }
    return state as State;
};

const getSchoolTypeFromExternalSchool = (school?: ExternalSchool) => {
    const schoolType = school?.school_type?.toLowerCase();
    if (!schoolType) {
        return;
    }
    return SchoolTypeMap[schoolType];
};

interface SearchSchoolsArgs {
    filters: { name: string };
    options: { limit: number };
}

export const searchExternalSchools = async (params: SearchSchoolsArgs): Promise<SchoolResult[]> => {
    const { filters, options } = params;
    try {
        const response = await fetch(`https://jedeschule.codefor.de/schools/?limit=${Math.min(options.limit, 50)}&include_raw=false&name=${filters.name}`);
        if (response.ok) {
            const schools = (await response.json()) as ExternalSchool[];
            return schools.map((school) => ({ ...school, state: getStateFromExternalSchool(school), schooltype: getSchoolTypeFromExternalSchool(school) }));
        }
        const responseText = await response.text();
        throw new Error(`Failed to fetch external schools due to ${responseText} - Status: ${response.status}`);
    } catch (error) {
        logger.error('Error fetching external schools', error, params);
        throw error;
    }
};
