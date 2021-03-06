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
}