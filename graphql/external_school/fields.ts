import { Arg, Authorized, Field, InputType, Int, ObjectType, Query, Resolver } from 'type-graphql';
import { SchoolResult, searchExternalSchools } from '../../common/school/externalSearch';
import { pupil_state_enum as State, pupil_schooltype_enum as SchoolType } from '@prisma/client';
import { Role } from '../authorizations';

@ObjectType()
class ExternalSchoolSearch implements SchoolResult {
    @Field(() => String)
    id: string;
    @Field(() => String)
    name: string;
    @Field(() => State)
    state: State;
    @Field(() => SchoolType, { nullable: true })
    school_type?: SchoolType;
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

@InputType()
class ExternalSchoolSearchOptions {
    @Field((type) => Int, { defaultValue: 20 })
    limit: number;
}

@Resolver((of) => ExternalSchoolSearch)
export class ExternalSchoolResolver {
    @Query((returns) => [ExternalSchoolSearch])
    @Authorized(Role.UNAUTHENTICATED)
    externalSchoolSearch(@Arg('filters') filters: ExternalSchoolSearchFilters, @Arg('options') options: ExternalSchoolSearchOptions) {
        return searchExternalSchools({ filters, options });
    }
}
