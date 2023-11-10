import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { isDev } from '../common/util/environment';

const userHeader = { authorization: 'Bearer <somerandombearer>' };
const adminHeader = { authorization: `Basic ${btoa('admin:' + process.env.ADMIN_AUTH_TOKEN)}` };

const endpoint = '/apollo';

const loginQuery = `mutation {
   # Place some random Bearer token in the tab HTTP Headers, then log in using one of these mutations:

   # Token Login:
   loginToken(token: "authtokenP1") # Log in as Pupil 1
   # loginToken(token: "authtokenS1") # Log in as Student 1

   # Password Login:
   # loginPassword(email: "test+dev+p1@lern-fair.de" password: "test")
   # loginPassword(email: "test+dev+s1@lern-fair.de" password: "test")
}`;

const meQuery = `query {
    # Once a session is authenticates (use the same Bearer Token for this query) a user can query their own data through the me query:

    # The roles assigned to this session:
    myRoles

    # All users (except for ADMIN and other technical accounts) can query their data through me:
    me {
        # The userID is unique across all users, and looks like "student/{student.id}"
        userID
        # Some data is available for all users:
        firstname
        lastname
        email

        # All users can receive notifications:
        # To limit the number of data received from the backend, we use pagination with 'take' and 'skip':
        concreteNotifications(take: 10 skip: 0) {
            sentAt
            notification { description }
        }

        # All users can log in using different secrets (the thing used in loginToken or loginPassword):
        secrets {
            type
            description
            expiresAt
            lastUsed
        }

        # Every user has appointments:
        appointments(take: 10 skip: 0) {
            start
            duration
            title
        }

        # Most data is actually stored depending on the user type, these edges are null if the user is not a pupil or student:
        # Role PUPIL
        pupil {
            state
            schooltype
            subjectsFormatted { name mandatory }
            grade
            aboutMe
            # ... explore other fields here

            # Course Participants (Role PARTICIPANT):
            subcoursesJoined {
              # To check whether users can do something, we use queries prefixed with 'can...' to get this info from the backend
              # That way we can keep frontend and backend in sync:
              canContactInstructor { allowed reason }
              appointments { start duration title isCanceled }
                course { name }
            }
            subcoursesWaitingList { course { name }}

            # Match Tutees (Role TUTEE):
            openMatchRequestCount

            matches {
                student { firstname lastname aboutMe }
              dissolved
              dissolvedAt
            }

            # Before matching we ask(ed) pupils to confirm their interest ...
            tutoringInterestConfirmation { status }
            # ... or they are screened and need to join a meeting:
            screenings { status invalidated }
        }

        # Helpers, historically called Students:
        # Role STUDENT
        student {
            subjectsFormatted { name grade { min max }}
            state
            university
            languages

            # Before doing stuff at Lern-Fair, we talk to each helper,
            # these screenings were historically done per role
            tutorScreenings {
                jobStatus
              knowsCoronaSchoolFrom
              success
            }
            instructorScreenings {
                jobStatus
              knowsCoronaSchoolFrom
              success
            }

            # We require a certifciate of conduct from each helper, and deactivate their account if not:
            certificateOfConductDeactivationDate
            certificateOfConduct { dateOfInspection dateOfIssue criminalRecords }

            # Course Instructors (Role INSTRUCTOR):
            canCreateCourse { allowed reason }
            # Courses are templates for multiple 'Subcourses':
            coursesInstructing {
              id
                name
              description
              tags { name }
              courseState
              image
              allowContact
            }

            subcoursesInstructing {
                course { id }
              minGrade
              maxGrade
              maxParticipants
              joinAfterStart

              appointments { start duration title }

              participants { firstname lastname }
            }


            # Match Tutor (Role TUTOR):
            matches {
                pupil { firstname lastname aboutMe }
              dissolved
              dissolvedAt
            }
        }


    }
}`;

const adminQuery = `query {
    # To run queries as a user with role ADMIN, use the ADMIN_AUTH_TOKEN configured in the environment to do Basic authentication, i.e.:
    # (1) Start the backend with ADMIN_AUTH_TOKEN=admin npm run web
    # (2) calculate "Basic " + btoa("admin:" + ADMIN_AUTH_TOKEN), i.e. "Basic YWRtaW46YWRtaW4="
    # (3) Place the Basic Auth Token into the 'authorization' header

    # Then just execute any query that fetches any data, i.e. this one to find a specific user
    students(where: { email: { contains: "@lern-fair.de" }} take: 100) {
        email
        firstname
        lastname
        matches {
            dissolved
            pupil { firstname lastname }
        }
    }
}`;

const DEV_TABS = [
    {
        name: 'Login as User',
        endpoint,
        query: loginQuery,
        headers: userHeader,
    },
    {
        name: 'Query User Data',
        endpoint,
        query: meQuery,
        headers: userHeader,
    },
    {
        name: 'Admin Queries',
        endpoint,
        query: adminQuery,
        headers: adminHeader,
    },
];

const PROD_TABS = [
    {
        name: 'Lernfair Production API',
        endpoint,
        query: `# Welcome to the LernFair Production API!\n# To make yourself familiar with GraphQL, use our staging instance first:ņ# https://lernfair-backend-dev.herokuapp.com/apollo`,
    },
];

export const playground = ApolloServerPluginLandingPageGraphQLPlayground({
    tabs: isDev ? DEV_TABS : PROD_TABS,
});
