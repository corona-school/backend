enum LogType {
    MISC = "misc",
    VERIFICATION_REQUEST = "verificationRequets",
    VERIFIED = "verified",
    MATCH_DISSOLVE = "matchDissolve",
    FETCHED_FROM_WIX = "fetchedFromWix",
    DEACTIVATE = "deActivate",
    UPDATE_PERSONAL = "updatePersonal",
    UPDATE_SUBJECTS = "updateSubjects",
    ACCESSED_BY_SCREENER = "accessedByScreener",
    UPDATED_BY_SCREENER = "updatedByScreener",
    UPDATE_STUDENT_DESCRIPTION = "updateStudentDescription",
    CREATED_COURSE = "createdCourse",
    CERTIFICATE_REQUEST = "certificateRequest",
    CANCELLED_COURSE = "cancelledCourse",
    CANCELLED_SUBCOURSE = "cancelledSubcourse",
    CREATED_COURSE_ATTENDANCE_LOG = "createdCourseAttendanceLog",
    CONTACT_MENTOR = "contactMentor"
}

export default LogType;
