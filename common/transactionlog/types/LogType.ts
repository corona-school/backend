enum LogType {
    MISC = "misc",
    VERIFICATION_REQUEST = "verificationRequets",
    VERIFIED = "verified",
    VERIFIED_CODE = "verifiedCode",
    MATCH_DISSOLVE = "matchDissolve",
    PROJECT_MATCH_DISSOLVE = "projectMatchDissolve",
    FETCHED_FROM_WIX = "fetchedFromWix",
    DEACTIVATE = "deActivate",
    UPDATE_PERSONAL = "updatePersonal",
    UPDATE_SUBJECTS = "updateSubjects",
    UPDATE_PROJECTFIELDS = "updateProjectFields",
    ACCESSED_BY_SCREENER = "accessedByScreener",
    UPDATED_BY_SCREENER = "updatedByScreener",
    UPDATE_STUDENT_DESCRIPTION = "updateStudentDescription",
    CREATED_COURSE = "createdCourse",
    CERTIFICATE_REQUEST = "certificateRequest",
    CANCELLED_COURSE = "cancelledCourse",
    CANCELLED_SUBCOURSE = "cancelledSubcourse",
    CREATED_COURSE_ATTENDANCE_LOG = "createdCourseAttendanceLog",
    CONTACT_MENTOR = "contactMentor",
    CREATED_BBB_MEETING = "bbbMeeting"
}

export default LogType;
