import * as TypeGraphQL from "type-graphql";

export enum log_logtype_enum {
  misc = "misc",
  verificationRequets = "verificationRequets",
  verified = "verified",
  matchDissolve = "matchDissolve",
  projectMatchDissolve = "projectMatchDissolve",
  fetchedFromWix = "fetchedFromWix",
  deActivate = "deActivate",
  updatePersonal = "updatePersonal",
  updateSubjects = "updateSubjects",
  updateProjectFields = "updateProjectFields",
  accessedByScreener = "accessedByScreener",
  updatedByScreener = "updatedByScreener",
  updateStudentDescription = "updateStudentDescription",
  createdCourse = "createdCourse",
  certificateRequest = "certificateRequest",
  cancelledCourse = "cancelledCourse",
  cancelledSubcourse = "cancelledSubcourse",
  createdCourseAttendanceLog = "createdCourseAttendanceLog",
  contactMentor = "contactMentor",
  bbbMeeting = "bbbMeeting",
  contactExpert = "contactExpert",
  participantJoinedCourse = "participantJoinedCourse",
  participantLeftCourse = "participantLeftCourse",
  participantJoinedWaitingList = "participantJoinedWaitingList",
  participantLeftWaitingList = "participantLeftWaitingList",
  userAccessedCourseWhileAuthenticated = "userAccessedCourseWhileAuthenticated",
  instructorIssuedCertificate = "instructorIssuedCertificate",
  pupilInterestConfirmationRequestSent = "pupilInterestConfirmationRequestSent",
  pupilInterestConfirmationRequestReminderSent = "pupilInterestConfirmationRequestReminderSent",
  pupilInterestConfirmationRequestStatusChange = "pupilInterestConfirmationRequestStatusChange"
}
TypeGraphQL.registerEnumType(log_logtype_enum, {
  name: "log_logtype_enum",
  description: undefined,
});
