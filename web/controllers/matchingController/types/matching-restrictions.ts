import { State as StateEntity } from "../../../../common/entity/State";
import { IsInt, IsDate, IsEnum, ValidateNested, IsString, IsOptional, IsBoolean, IsArray } from "class-validator";
import { Type } from 'class-transformer';

export type EmailAddress = string;
export type SubjectName = string;
export type State = StateEntity;

export class ApiMatchingPriorityRestrictions {
    @IsInt()
    @IsOptional()
    min?: number;
    @IsInt()
    @IsOptional()
    max?: number;
}
export class ApiRegistrationDateRestrictions {
    @Type(() => Date)
    @IsOptional()
    @IsDate()
    min?: Date;
    @Type(() => Date)
    @IsOptional()
    @IsDate()
    max?: Date;
}

export class ApiMatchingRestriction {
    @IsOptional()
    @IsString({
        each: true
    })
    emails?: EmailAddress[];

    @IsOptional()
    @IsString({
        each: true
    })
    blockingList?: EmailAddress[];

    @IsOptional()
    @IsEnum(StateEntity)
    state?: State;

    @Type(() => ApiRegistrationDateRestrictions)
    @ValidateNested()
    @IsOptional()
    registrationDate?: ApiRegistrationDateRestrictions;

    @IsOptional()
    @IsString({
        each: true
    })
    subjectNames?: SubjectName[];
}

export class ApiTutorMatchingRestriction extends ApiMatchingRestriction {
    @IsOptional()
    @IsBoolean()
    isIntern?: boolean;
}

export class ApiTuteeMatchingRestriction extends ApiMatchingRestriction {
    @Type(() => ApiMatchingPriorityRestrictions) //required for nested transformations
    @ValidateNested()
    @IsOptional()
    matchingPriority?: ApiMatchingPriorityRestrictions;
}

export class ApiMatchingRestrictions {
    @Type(() => ApiTuteeMatchingRestriction)
    @ValidateNested()
    @IsOptional()
    @IsArray()
    tuteeRestrictions?: ApiTuteeMatchingRestriction[];

    @Type(() => ApiTutorMatchingRestriction)
    @ValidateNested()
    @IsOptional()
    @IsArray()
    tutorRestrictions?: ApiTutorMatchingRestriction[];
}