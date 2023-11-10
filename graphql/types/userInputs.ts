import { BecomeTuteeData, RegisterPupilData } from '../../common/pupil/registration';
import { InputType, Field, Int } from 'type-graphql';
import { Subject } from './subject';
import { MaxLength } from 'class-validator';
import {
    pupil_learninggermansince_enum as LearningGermanSince,
    pupil_languages_enum as Language,
    pupil_registrationsource_enum as RegistrationSource,
    pupil_schooltype_enum as SchoolType,
    pupil_state_enum as State,
    student_module_enum as TeacherModule,
    school as School,
} from '@prisma/client';
import { ValidateEmail } from '../validators';
import { BecomeTutorData, RegisterStudentData } from '../../common/student/registration';

@InputType()
export class BecomeTuteeInput implements BecomeTuteeData {
    @Field((type) => [Subject])
    subjects: Subject[];

    @Field((type) => [Language])
    languages: Language[];

    @Field((type) => LearningGermanSince, { nullable: true })
    learningGermanSince?: LearningGermanSince;

    @Field((type) => Int)
    gradeAsInt: number;
}

@InputType()
export class RegisterPupilInput implements RegisterPupilData {
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

    @Field((type) => Int, { nullable: true })
    schoolId?: School['id'];

    @Field((type) => SchoolType, { nullable: true })
    schooltype?: SchoolType;

    @Field((type) => State)
    state: State;

    @Field((type) => RegistrationSource)
    registrationSource: RegistrationSource;

    @Field((type) => String, { defaultValue: '' })
    @MaxLength(500)
    aboutMe: string;

    /* After registration, the user receives an email to verify their account.
       The user is redirected to this URL afterwards to continue with whatever they're registering for */
    @Field((type) => String, { nullable: true })
    redirectTo?: string;
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
