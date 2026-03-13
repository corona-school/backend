import { school_state_enum as State, pupil_schooltype_enum as SchoolType } from '@prisma/client';
import { getLogger } from '../logger/logger';
import { getStateFromZip } from '../util/stateMappings';
import { SchoolTypeMap, schoolTypeSearchStrings } from './schoolType';

interface GooglePlaceSuggestion {
    placePrediction: {
        placeId: string;
        text: {
            text: string;
        };
    };
}

interface GooglePlaceDetails {
    id: string;
    displayName: {
        text: string;
    };
    shortFormattedAddress: string;
    addressComponents: {
        longText: string;
        shortText: string;
        types: string[];
    }[];
    googleMapsTypeLabel: {
        text: string;
    };
}

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
    state?: State;
}

const logger = getLogger('ExternalSchoolSearch');

const getSchoolTypeFromExternalSchool = ({ name, schoolType }: { name: string; schoolType?: string }) => {
    // first check if the schoolType from google maps can be directly mapped to our SchoolType enum
    const schoolTypeFromMap = schoolType ? SchoolTypeMap[schoolType.toLowerCase()] : undefined;
    if (schoolTypeFromMap) {
        return schoolTypeFromMap;
    }

    // if not, use the school name and check if it contains any of the search strings defined for each school type
    for (const [type, searchStrings] of Object.entries(schoolTypeSearchStrings) as [SchoolType, string[]][]) {
        for (const str of searchStrings) {
            const regex = new RegExp(`\\b${str}\\b`, 'i');
            if (regex.test(name.toLowerCase())) {
                return type;
            }
        }
    }
};

interface SearchSchoolsArgs {
    filters: { name: string };
}

export const searchExternalSchools = async (params: SearchSchoolsArgs): Promise<SchoolResult[]> => {
    const { filters } = params;
    try {
        const response = await fetch(`https://places.googleapis.com/v1/places:autocomplete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': process.env.GOOGLE_PLACES_KEY || '',
            },
            body: JSON.stringify({
                input: filters.name,
                includedPrimaryTypes: ['preschool', 'primary_school', 'school', 'secondary_school', 'university'],
                includedRegionCodes: ['de'],
                languageCode: 'de',
                regionCode: 'de',
            }),
        });
        if (response.ok) {
            const suggestions = ((await response.json()) as { suggestions: GooglePlaceSuggestion[] }).suggestions ?? [];
            return suggestions.map((school) => ({ id: school.placePrediction.placeId, name: school.placePrediction.text.text }));
        }
        const responseText = await response.text();
        throw new Error(`Failed to fetch external schools due to ${responseText} - Status: ${response.status}`);
    } catch (error) {
        logger.error('Error fetching external schools', error, params);
        throw error;
    }
};

export const getSchoolDetails = async (placeId: string): Promise<SchoolResult> => {
    try {
        const response = await fetch(
            `https://places.googleapis.com/v1/places/${placeId}?key=${process.env.GOOGLE_PLACES_KEY}&fields=id,displayName,shortFormattedAddress,addressComponents,googleMapsTypeLabel&languageCode=de`
        );
        if (response.ok) {
            const school = (await response.json()) as GooglePlaceDetails;
            const zip = school.addressComponents.find((comp) => comp.types.includes('postal_code'))?.longText;
            return {
                id: school.id,
                name: `${school.displayName.text}${school.shortFormattedAddress ? `, ${school.shortFormattedAddress}` : ''}`,
                city: school.addressComponents.find((comp) => comp.types.includes('locality'))?.longText,
                zip,
                state: getStateFromZip(zip ? Number(zip) : undefined) as State | undefined,
                schooltype: getSchoolTypeFromExternalSchool({ name: school.displayName.text, schoolType: school.googleMapsTypeLabel.text }),
            };
        }
        const responseText = await response.text();
        throw new Error(`Failed to fetch external school details due to ${responseText} - Status: ${response.status}`);
    } catch (error) {
        logger.error('Error fetching external school details', error, { placeId });
        throw error;
    }
};
