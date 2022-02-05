# GraphQL Walkthrough

### 1. Creating a Session

To connect with the The GraphQL Endpoint under `https://[backend-host]/apollo`
 (POST request can be sent to actually run GraphQL queries, a GET shows an interactive UI). To authenticate the Authorization header is used.
 It supports either Basic Authentication for other servers connecting to it, 
  or Bearer Session Authentication for users. 
The session is generated at the client, which should pass in a long and random string as a session token. 

### 2a. Logging in

To log in as a user inside a session, various mutations are supported. 
The most common one is the `loginLegacy` mutation which takes the well-known "authToken":

```gql
mutate {
    loginLegacy(authToken: "authtokenP1")
}
```

### 2b. Registration

To create a new user account instead of logging in, one can use the `meRegister(Pupil|Student)` mutations:

```gql
mutation { 
	meRegisterPupil(data: { 
  	firstname: "Jonas"
    lastname: "Wilms"
    email: "test+jonas@lern-fair.de"
    newsletter: false
    schoolId: 1
    state: ni
    registrationSource: cooperation
  })

  # or alternatively

  meRegisterStudent(data: { 
  	firstname: "Jonas"
    lastname: "Student"
    email: "test+jonas+student@lern-fair.de"
    newsletter: false
    registrationSource: normal
  })
}
```

This will also directly associate the created account with the current session. 
The pupil or student account itself are however pretty much useless, 
 as depending on whether the user wants to do tutoring, project coaching or courses, 
 further information is needed. This can then be passed in through the `meBecome(Tutee|Participant|ProjectCoachee)` mutations for pupils and the `meBecome(Tutor|Instructor|ProjectCoach)` mutations for students. 
Depending on the requested role the user might need to take further steps, 
 such as participating in a screening session. This can be checked by querying `me { pupil { canRequestMatch { allowed reason }}}` or other resolvers starting with `can`. 
If the user fulfills all preconditions, another Role is granted to them and further mutations can be called.

### 3. Retrieving the User's data

All data directly related to the logged-in user is available under the `me` resolver. 

To fetch all released fields the following query can be used, though usually one would only fetch parts of it, depending on the applications context:

```gql
query { 
	me { 
  	firstname
    lastname
    email

    pupil { 
      # Pupil data
    	state
      learningGermanSince
      languages
  		schooltype
      newsletter
      registrationSource
      
      # Tutoring  
      canRequestMatch { allowed reason limit}
      openMatchRequestCount
      gradeAsInt
      subjectsFormatted { 
        name
      }
      tutoringInterestConfirmation { 
      	status
        token
      }
      
      participationCertificatesToSign { 
      	id
        subjects
        categories
        certificateDate
        startDate
        endDate
        hoursPerWeek
        hoursTotal
        medium
        ongoingLessons
        state
        startDate
    
      }
      
      matches { 
      	dissolved
        dissolveReason
        proposedTime
        student { firstname lastname }
      }
      
      # Project Matching
      projectFields
      openProjectMatchRequestCount

      
      # State Pupil
      teacherEmailAddress
      
      # Courses
      canJoinSubcourses { allowed reason limit }
      subcoursesJoined { 
      	course { name outline description }
        minGrade
        maxGrade
        lectures { start duration }
      }
      
    }
    
    student { 
    	# Student data
      newsletter
      subjectsFormatted { name grade { min max } }
      openMatchRequestCount
      state
      university
      module
      moduleHours
      languages
      
      # Project Matching
      openProjectMatchRequestCount
      
      # Tutoring
      participationCertificates { 
      	subjectsFormatted
        categories
        startDate
        endDate
        hoursPerWeek
        hoursTotal
        medium
        ongoingLessons
        state
      }
      
      matches { 
      	dissolved
        proposedTime
        pupil { firstname lastname }
      }
      
      canRequestMatch { allowed reason limit }
    }
  }
}
```

