import { RegisterPupilData } from '../../common/pupil/registration';
import { InputType, Field, Int } from 'type-graphql';
import { Subject } from './subject';
import { MaxLength } from 'class-validator';
import {
    pupil_learninggermansince_enum as LearningGermanSince,
    pupil_languages_enum as Language,
    pupil_registrationsource_enum as RegistrationSource,
    pupil_schooltype_enum as SchoolType,
    pupil_state_enum as State,
    school as School,
    pupil_email_owner_enum as PupilEmailOwner,
} from '@prisma/client';
import { ValidateEmail } from '../validators';
import { BecomeTutorData, RegisterStudentData } from '../../common/student/registration';

@InputType()
export class RegistrationSchool {
    @Field((type) => String, { nullable: true })
    name?: School['name'];

    @Field((type) => String, { nullable: true })
    zip?: School['zip'];

    @Field((type) => String, { nullable: true })
    city?: School['city'];

    @Field((type) => String, { nullable: true })
    email?: School['email'];

    @Field((type) => State, { nullable: true })
    state?: School['state'];

    @Field((type) => SchoolType, { nullable: true })
    schooltype?: School['schooltype'];
}

@InputType()
export class RegisterPupilInput implements RegisterPupilData {
    @Field((type) => String)
    @MaxLength(100)
    firstname: string;

    @Field((type) => String)
    @MaxLength(100)
    lastname: string;

    @Field((type) => PupilEmailOwner)
    emailOwner: PupilEmailOwner;

    @Field((type) => String)
    @ValidateEmail()
    email: string;

    @Field((type) => Boolean)
    newsletter: boolean;

    @Field((type) => RegistrationSource)
    registrationSource: RegistrationSource;

    @Field((type) => String, { defaultValue: '' })
    @MaxLength(500)
    aboutMe: string;

    /* After registration, the user receives an email to verify their account.
       The user is redirected to this URL afterwards to continue with whatever they're registering for */
    @Field((type) => String, { nullable: true })
    redirectTo?: string;

    @Field((type) => RegistrationSchool, { nullable: true })
    school?: RegistrationSchool;

    @Field((type) => String, { nullable: true })
    referredById?: string;
}

@InputType()
export class RegisterStudentInput implements RegisterStudentData {
    @Field((type) => String)
    @MaxLength(100)
    firstname: string;

    @Field((type) => String)
    @MaxLength(100)
    lastname: string;

    @Field((type) => String)
    @ValidateEmail()
    email: string;

    @Field((type) => Boolean)
    newsletter: boolean;

    @Field((type) => Boolean)
    isAdult: boolean;

    @Field((type) => RegistrationSource)
    registrationSource: RegistrationSource;

    @Field((type) => String, { defaultValue: '' })
    @MaxLength(500)
    aboutMe: string;

    /* After registration, the user receives an email to verify their account.
   The user is redirected to this URL afterwards to continue with whatever they're registering for */
    @Field((type) => String, { nullable: true })
    redirectTo?: string;

    @Field((type) => String, { nullable: true })
    cooperationTag?: string;

    @Field((type) => String, { nullable: true })
    referredById?: string;
}

@InputType()
export class BecomeTutorInput implements BecomeTutorData {
    @Field((type) => [Subject], { nullable: true })
    subjects?: Subject[];

    @Field((type) => [Language], { nullable: true })
    languages?: Language[];

    @Field((type) => Boolean, { nullable: true })
    supportsInDaZ?: boolean;
}
