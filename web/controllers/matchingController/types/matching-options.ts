import { IsBoolean, IsEnum } from "class-validator";

export enum ApiNotificationOption {
    email = "email",
    sms = "sms",
    emailAndSMS = "email+sms",
    dbEntryOnly = "dbonly" //= no notification at all
}

export class ApiMatchingOptions {
    @IsBoolean()
    dryRun: boolean = false;
    @IsEnum(ApiNotificationOption)
    notifications: ApiNotificationOption = ApiNotificationOption.email;
    @IsBoolean()
    disableInterestConfirmationRestriction: boolean = false; //defines what matchable pupils will be, i.e. if only pupils with confirmed interest (or those from partnering schools) are allowed to be part of the matching
}