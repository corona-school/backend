import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNotEmptyObject, IsNumber, IsObject, ValidateIf, ValidateNested } from "class-validator";

export enum ApiNotificationOption {
    email = "email",
    sms = "sms",
    emailAndSMS = "email+sms",
    dbEntryOnly = "dbonly" //= no notification at all
}

export class ApiMatchingAlgoSettingsBalancingCoefficients {
    @IsNumber()
    subjectMatching: number;
    @IsNumber()
    state: number;
    @IsNumber()
    waitingTime: number;
    @IsNumber()
    matchingPriority: number;
}

export class ApiMatchingAlgoSettings {
    @Type(() => ApiMatchingAlgoSettingsBalancingCoefficients)
    @ValidateNested()
    balancingCoefficients: ApiMatchingAlgoSettingsBalancingCoefficients;
}

export class ApiMatchingOptions {
    @IsBoolean()
    dryRun: boolean = false;
    @IsEnum(ApiNotificationOption)
    notifications: ApiNotificationOption = ApiNotificationOption.email;
    @IsBoolean()
    disableInterestConfirmationRestriction: boolean = false; //defines what matchable pupils will be, i.e. if only pupils with confirmed interest (or those from partnering schools) are allowed to be part of the matching
    @Type(() => ApiMatchingAlgoSettings)
    @ValidateIf( obj => "matchingAlgoSettings" in obj) //only validate, if key is present (such that validation is also performed if set to null)
    @IsObject()
    @IsNotEmptyObject()
    @ValidateNested()
    matchingAlgoSettings?: ApiMatchingAlgoSettings;
}