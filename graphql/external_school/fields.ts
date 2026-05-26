import { Arg, Authorized, Field, InputType, Int, ObjectType, Query, Resolver } from 'type-graphql';
import { getSchoolDetails, SchoolResult, searchExternalSchools } from '../../common/school/externalSearch';
import { pupil_state_enum as State, pupil_schooltype_enum as SchoolType } from '@prisma/client';
import { Role } from '../authorizations';
import { RateLimit } from '../rate-limit';

@ObjectType()
class ExternalSchoolSearch implements SchoolResult {
    @Field(() => String)
    id: string;
    @Field(() => String)
    name: string;
    @Field(() => State, { nullable: true })
    state?: State;
    @Field(() => SchoolType, { nullable: true })
    schooltype?: SchoolType;
    @Field(() => String, { nullable: true })
    zip: string;
    @Field(() => String, { nullable: true })
    city: string;
    @Field(() => String, { nullable: true })
    email: string;
}

@InputType()
class ExternalSchoolSearchFilters {
    @Field((type) => String)
    name: string;
}

@Resolver((of) => ExternalSchoolSearch)
export class ExternalSchoolResolver {
    @Query((returns) => [ExternalSchoolSearch])
    @Authorized(Role.UNAUTHENTICATED)
    @RateLimit('ExternalSchoolSearch', 100 /* requests per */, 5 * 60 * 60 * 1000 /* 5 hours */)
    externalSchoolSearch(@Arg('filters') filters: ExternalSchoolSearchFilters) {
        return searchExternalSchools({ filters });
    }

    @Query((returns) => ExternalSchoolSearch)
    @Authorized(Role.UNAUTHENTICATED)
    @RateLimit('SchoolDetail', 100 /* requests per */, 5 * 60 * 60 * 1000 /* 5 hours */)
    schoolDetail(@Arg('schoolId') id: string) {
        return getSchoolDetails(id);
    }
}
