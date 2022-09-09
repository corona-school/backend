import { Screener } from '../entity/Screener';

export class ScreenerDTO {
    firstname: string;
    lastname: string;
    email: string;
    verified: boolean;
    passwordHash: string;
    active: boolean;
    constructor(screener: Screener) {
        this.firstname = screener.firstname;
        this.lastname = screener.lastname;
        this.email = screener.email;
        this.verified = screener.verified;
        this.passwordHash = screener.password;
        this.active = screener.active;
    }

    isValid(): boolean {
        let isValid: boolean = true;

        isValid = this.firstname == null ? false : isValid;
        isValid = this.lastname == null ? false : isValid;
        isValid = this.email == null ? false : isValid;
        isValid = this.passwordHash == null ? false : isValid;

        return isValid;
    }
}
