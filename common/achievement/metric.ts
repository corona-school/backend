import { ActionID } from '../notification/actions';
import { registerAllMetrics } from './metrics';
import { FormulaFunction, Metric } from './types';

// This function utilizes generics to ensure flexibility in the ActionIDs and their respective contexts, allowing for dynamic metric creation.
function createMetric<T extends ActionID>(metricName: string, onActions: T[], formula: FormulaFunction<T>): Metric {
    return {
        metricName,
        onActions,
        formula,
    };
}

const batchOfMetrics = [
    /* STUDENT ONBOARDING */
    createMetric('student_onboarding_verified', ['student_registration_verified_email'], () => {
        return 1;
    }),
    //! relevant if calendly API is integrated
    createMetric('student_onboarding_appointment_booked', ['student_calendly_appointment_booked'], () => {
        return 1;
    }),
    createMetric('student_onboarding_screened', ['student_screening_appointment_done', 'tutor_screening_success', 'instructor_screening_success'], () => {
        return 1;
    }),
    createMetric('student_onboarding_coc_success', ['student_coc_updated'], () => {
        return 1;
    }),
    /* PUPIL ONBOARDING */
    createMetric('pupil_onboarding_verified', ['pupil_registration_verified_email'], () => {
        return 1;
    }),
    //! relevant if calendly API is integrated
    createMetric('pupil_onboarding_appointment_booked', ['pupil_calendly_appointment_booked'], () => {
        return 1;
    }),
    createMetric('pupil_onboarding_screened', ['pupil_screening_appointment_done', 'pupil_screening_add', 'pupil_screening_succeeded'], () => {
        return 1;
    }),

    /* CONDUCTED MATCH APPOINTMENT */
    createMetric('student_conducted_match_appointment', ['student_joined_match_meeting'], () => {
        return 1;
    }),
    createMetric('pupil_conducted_match_appointment', ['pupil_joined_match_meeting'], () => {
        return 1;
    }),

    /* CONDUCTED SUBCOURSE APPOINTMENT */
    createMetric('student_conducted_subcourse_appointment', ['student_joined_subcourse_meeting'], () => {
        return 1;
    }),
    createMetric('pupil_conducted_subcourse_appointment', ['pupil_joined_subcourse_meeting'], () => {
        return 1;
    }),

    /* REGULAR MATCH LEARNING */
    createMetric('pupil_match_learned_regular', ['pupil_joined_match_meeting'], () => {
        return 1;
    }),
    createMetric('student_match_learned_regular', ['student_joined_match_meeting'], () => {
        return 1;
    }),

    /* OFFER COURSE */
    createMetric('student_create_course', ['instructor_course_created'], () => {
        return 1;
    }),
    createMetric('student_submit_course', ['instructor_course_submitted'], () => {
        return 1;
    }),
    createMetric('student_approve_course', ['instructor_course_approved'], () => {
        return 1;
    }),

    // TODO: new match metric listening to 2 actions - screening_success and match_requested

    // TODO: attendance and punctuality records only for pupils - actions: pupil_joined_match_meeting, pupil_joined_subcourse_meeting
];

export function registerAchievementMetrics() {
    registerAllMetrics(batchOfMetrics);
}
