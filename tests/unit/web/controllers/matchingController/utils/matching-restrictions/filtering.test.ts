import "reflect-metadata"; //required, if not pre-loaded in another place (which isn't done if this test file is executed isolated)
import { assert } from "chai";
import { ApiTuteeMatchingRestriction, ApiTutorMatchingRestriction } from "../../../../../../../web/controllers/matchingController/types/matching-restrictions";
import { tuteeMatchingRestrictionFilter, tutorMatchingRestrictionFilter } from "../../../../../../../web/controllers/matchingController/utils/matching-restrictions/filtering";
import { createPupil, createStudent } from "../../../../../../utils/test-data";
import faker from "faker";
import { State } from "../../../../../../../common/entity/State";

function createTutorRestriction(init: Readonly<ApiTutorMatchingRestriction> = {}): ApiTutorMatchingRestriction {
    return Object.assign(new ApiTutorMatchingRestriction(), init);
}
function createTuteeRestriction(init: Readonly<ApiTuteeMatchingRestriction> = {}): ApiTuteeMatchingRestriction {
    return Object.assign(new ApiTuteeMatchingRestriction(), init);
}


describe("Matching Restrictions Filter ", function() {
    this.timeout(5000);

    // No Restrictions
    it("No restrictions (for tutors)", function() {
        // ARRANGE
        const tutorRestriction = createTutorRestriction({});
        const tutorFilter = tutorMatchingRestrictionFilter(tutorRestriction);

        const someTutors = [
            createStudent(),
            createStudent(),
            createStudent()
        ];

        // ACT
        const filteredTutors = someTutors.filter(tutorFilter);

        // ASSERT
        assert.deepEqual(filteredTutors, someTutors);
    });

    it("No restrictions (for tutees)", function() {
        // ARRANGE
        const tuteeRestriction = createTuteeRestriction({});
        const tuteeFilter = tuteeMatchingRestrictionFilter(tuteeRestriction);

        const someTutees = [
            createPupil(),
            createPupil(),
            createPupil()
        ];

        // ACT
        const filteredTutees = someTutees.filter(tuteeFilter);

        // ASSERT
        assert.deepEqual(filteredTutees, someTutees);
    });

    // Matching Priority Restrictions
    it("Matching priority restrictions (for tutees, only)", function() {
        // ARRANGE
        const tuteeRestriction = createTuteeRestriction({
            matchingPriorities: [
                {
                    min: 100,
                    max: 142
                }
            ]
        });

        const tuteeFilter = tuteeMatchingRestrictionFilter(tuteeRestriction);

        const someTutees = [
            createPupil({
                matchingPriority: 142
            }),
            createPupil({
                matchingPriority: 100
            }),
            createPupil({
                matchingPriority: 143
            }),
            createPupil({
                matchingPriority: 99
            }),
            createPupil({
                matchingPriority: -100
            })
        ];

        // ACT
        const filteredTutees = someTutees.filter(tuteeFilter);

        // ASSERT
        assert.deepEqual(filteredTutees, someTutees.slice(0, 2));
    });

    // Intern Restrictions
    it("Intern restrictions (for tutors, only)", function() {
        // ARRANGE
        const tutorRestrictionIsIntern = createTutorRestriction({
            isIntern: true
        });
        const tutorRestrictionIsNoIntern = createTutorRestriction({
            isIntern: false
        });

        const tutorFilterIsIntern = tutorMatchingRestrictionFilter(tutorRestrictionIsIntern);
        const tutorFilterIsNoIntern = tutorMatchingRestrictionFilter(tutorRestrictionIsNoIntern);

        const interns = [
            createStudent({
                intern: true
            }),
            createStudent({
                intern: true
            }),
            createStudent({
                intern: true
            })
        ];
        const noInterns = [
            createStudent({
                intern: false
            }),
            createStudent({
                intern: false
            }),
            createStudent({
                intern: false
            })
        ];
        const someTutors = [...interns, ...noInterns];

        // ACT
        const filteredInterns = someTutors.filter(tutorFilterIsIntern);
        const filteredNoInterns = someTutors.filter(tutorFilterIsNoIntern);

        // ASSERT
        assert.deepEqual(filteredInterns, interns);
        assert.deepEqual(filteredNoInterns, noInterns);
    });

    // Registration Date Restrictions
    it("Registration Date Restrictions (for tutors)", function() {
        // ARRANGE
        const tutorRestriction = createTutorRestriction({
            registrationDates: [
                {
                    min: new Date("2021-03-07T10:35:00"),
                    max: new Date("2021-03-31T09:00:00")
                },
                {
                    min: new Date("2021-04-01T10:00:00")
                }
            ]
        });

        const tutorFilter = tutorMatchingRestrictionFilter(tutorRestriction);

        const someTutors = [
            createStudent({
                registrationDate: new Date("2021-03-11")
            }),
            createStudent({
                registrationDate: new Date("2021-03-31T09:00:00")
            }),
            createStudent({
                registrationDate: new Date("2021-04-01T09:00:00")
            })
        ];

        // ACT
        const filteredTutors = someTutors.filter(tutorFilter);

        // ASSERT
        assert.deepEqual(filteredTutors, someTutors.slice(0, 2));
    });

    it("Registration Date Restrictions (for tutees)", function() {
        // ARRANGE
        const tuteeRestriction = createTuteeRestriction({
            registrationDates: [
                {
                    min: new Date("2021-02-10T03:03:03")
                },
                {
                    max: new Date("2021-02-01T03:03:03")
                }
            ]
        });

        const tuteeFilter = tuteeMatchingRestrictionFilter(tuteeRestriction);

        const someTutees = [
            createPupil({
                registrationDate: new Date("2021-02-03")
            }),
            createPupil({
                registrationDate: new Date("2021-10-03")
            }),
            createPupil({
                registrationDate: new Date("2021-01-01")
            })
        ];

        // ACT
        const filteredTutees = someTutees.filter(tuteeFilter);

        // ASSERT
        assert.deepEqual(filteredTutees, someTutees.slice(1, 3));
    });

    // Subject Names
    it("Subject Name Restrictions (for tutors)", function() {
        // ARRANGE
        const tutorRestriction = createTutorRestriction({
            subjectNames: ["Deutsch", "Englisch"]
        });

        const tutorFilter = tutorMatchingRestrictionFilter(tutorRestriction);

        const matchingTutors = [
            createStudent({
                subjects: [
                    {
                        name: "Mathematik",
                        grade: {
                            min: 1,
                            max: 10
                        }
                    },
                    {
                        name: "Deutsch",
                        grade: {
                            min: 10,
                            max: 12
                        }
                    }
                ]
            }),
            createStudent({
                subjects: [
                    {
                        name: "Deutsch",
                        grade: {
                            min: 5,
                            max: 10
                        }
                    }
                ]
            }),
            createStudent({
                subjects: [
                    {
                        name: "Englisch"
                    }
                ]
            }),
            createStudent({
                subjects: [
                    {
                        name: "Englisch"
                    },
                    {
                        name: "Deutsch"
                    }
                ]
            })
        ];

        const notMatchingTutors = [
            createStudent({
                subjects: [
                    {
                        name: "Physik",
                        grade: {
                            min: 5,
                            max: 12
                        }
                    }
                ]
            }),
            createStudent({
                subjects: [
                    {
                        name: "Informatik",
                        grade: {
                            min: 12,
                            max: 12
                        }
                    },
                    {
                        name: "Biologie",
                        grade: {
                            min: 1,
                            max: 13
                        }
                    }
                ]
            })
        ];

        const someTutors = [...matchingTutors, ...notMatchingTutors];

        // ACT
        const filteredTutors = someTutors.filter(tutorFilter);

        // ASSERT
        assert.deepEqual(filteredTutors, matchingTutors);
    });

    it("Subject Name Restrictions (for tutees)", function() {
        // ARRANGE
        const tuteeRestriction = createTuteeRestriction({
            subjectNames: ["Französisch", "Altgriechisch", "Pädagogik"]
        });

        const tuteeFilter = tuteeMatchingRestrictionFilter(tuteeRestriction);

        const matchingTutees = [
            createPupil({
                subjects: [
                    {
                        name: "Pädagogik"
                    },
                    {
                        name: "Französisch"
                    },
                    {
                        name: "Altgriechisch"
                    }
                ]
            }),
            createPupil({
                subjects: [
                    {
                        name: "Altgriechisch"
                    }
                ]
            }),
            createPupil({
                subjects: [
                    {
                        name: "Pädagogik"
                    }
                ]
            }),
            createPupil({
                subjects: [
                    {
                        name: "Physik"
                    },
                    {
                        name: "Pädagogik"
                    },
                    {
                        name: "Französisch"
                    },
                    {
                        name: "Chemie"
                    }
                ]
            })
        ];

        const notMatchingTutees = [
            createPupil({
                subjects: [
                    {
                        name: "Englisch"
                    }
                ]
            }),
            createPupil({
                subjects: [
                    {
                        name: "Kunst"
                    },
                    {
                        name: "Niederländisch"
                    }
                ]
            })
        ];

        const someTutees = [...matchingTutees, ...notMatchingTutees];

        // ACT
        const filteredTutees = someTutees.filter(tuteeFilter);

        // ASSERT
        assert.deepEqual(filteredTutees, matchingTutees);
    });

    // Email Restrictions
    it("Email Address Restrictions (for tutors)", function() {
        // ARRANGE
        const tutorRestriction = createTutorRestriction({
            emails: ["t1@example.org", "t2@example.org"]
        });

        const tutorFilter = tutorMatchingRestrictionFilter(tutorRestriction);

        const matchingTutors = [
            createStudent({
                email: "t1@example.org"
            }),
            createStudent({
                email: "T2@example.org"
            })
        ];

        const notMatchingTutors = [
            createStudent({
                email: "t424@example.org"
            }),
            createStudent({
                email: "T52@example.org"
            }),
            createStudent({
                email: "t44@example.org"
            }),
            createStudent({
                email: "t42@example.org"
            })
        ];

        const someTutors = faker.helpers.shuffle([...matchingTutors, ...notMatchingTutors]);

        // ACT
        const filteredTutors = someTutors.filter(tutorFilter);

        // ASSERT
        assert.sameMembers(filteredTutors, matchingTutors);
    });

    it("Email Address Restrictions (for tutees)", function() {
        // ARRANGE
        const tuteeRestriction = createTuteeRestriction({
            emails: ["T1@example.org", "T2@example.org", "t3@example.org"]
        });

        const tuteeFilter = tuteeMatchingRestrictionFilter(tuteeRestriction);

        const matchingTutees = [
            createPupil({
                email: "T1@example.org"
            }),
            createPupil({
                email: "T2@example.org"
            })
        ];

        const notMatchingTutees = [
            createPupil({
                email: "T98@example.org"
            }),
            createPupil({
                email: "t52@example.org"
            }),
            createPupil({
                email: "t04@example.org"
            }),
            createPupil({
                email: "t-2@example.org"
            })
        ];

        const someTutees = faker.helpers.shuffle([...matchingTutees, ...notMatchingTutees]);

        // ACT
        const filteredTutees = someTutees.filter(tuteeFilter);

        // ASSERT
        assert.sameMembers(filteredTutees, matchingTutees);
    });

    // Email Blocking List
    it("Email Blocking List (for tutors)", function() {
        // ARRANGE
        const tutorRestriction = createTutorRestriction({
            blockingList: ["b1@example.org", "b2@example.org"]
        });

        const tutorFilter = tutorMatchingRestrictionFilter(tutorRestriction);

        const matchingTutors = [
            createStudent({
                email: "t1@example.org"
            }),
            createStudent({
                email: "T2@example.org"
            }),
            createStudent({
                email: "T3@example.org"
            })
        ];

        const notMatchingTutors = [
            createStudent({
                email: "b1@example.org"
            }),
            createStudent({
                email: "b2@example.org"
            })
        ];

        const someTutors = faker.helpers.shuffle([...matchingTutors, ...notMatchingTutors]);

        // ACT
        const filteredTutors = someTutors.filter(tutorFilter);

        // ASSERT
        assert.sameMembers(filteredTutors, matchingTutors);
    });

    it("Email Blocking List (for tutees)", function() {
        // ARRANGE
        const tuteeRestriction = createTuteeRestriction({
            blockingList: ["b1@example.org", "b2@example.org"]
        });

        const tuteeFilter = tuteeMatchingRestrictionFilter(tuteeRestriction);

        const matchingTutees = [];

        const notMatchingTutees = [
            createPupil({
                email: "b1@example.org"
            }),
            createPupil({
                email: "b2@example.org"
            })
        ];

        const someTutees = faker.helpers.shuffle([...matchingTutees, ...notMatchingTutees]);

        // ACT
        const filteredTutees = someTutees.filter(tuteeFilter);

        // ASSERT
        assert.sameMembers(filteredTutees, matchingTutees);
    });

    // State Restrictions
    it("State restrictions (for tutors)", function() {
        // ARRANGE
        const tutorRestriction = createTutorRestriction({
            states: [State.NW, State.BY]
        });

        const tutorFilter = tutorMatchingRestrictionFilter(tutorRestriction);

        const matchingTutors = [
            createStudent({
                state: State.BY
            }),
            createStudent({
                state: State.NW
            }),
            createStudent({
                state: State.NW
            })
        ];

        const notMatchingTutors = [
            createStudent({
                state: State.MV
            }),
            createStudent({
                state: State.OTHER
            })
        ];

        const someTutors = faker.helpers.shuffle([...matchingTutors, ...notMatchingTutors]);

        // ACT
        const filteredTutors = someTutors.filter(tutorFilter);

        // ASSERT
        assert.sameMembers(filteredTutors, matchingTutors);
    });

    it("State restrictions (for tutees)", function() {
        // ARRANGE
        const tuteeRestriction = createTuteeRestriction({
            states: Object.values(State)
        });

        const tuteeFilter = tuteeMatchingRestrictionFilter(tuteeRestriction);

        const matchingTutees = [
            createPupil({
                state: State.BY
            }),
            createPupil({
                state: State.NW
            }),
            createPupil({
                state: State.NW
            }),
            createPupil({
                state: State.MV
            }),
            createPupil({
                state: State.OTHER
            })
        ];

        const notMatchingTutees = [];

        const someTutees = faker.helpers.shuffle([...matchingTutees, ...notMatchingTutees]);

        // ACT
        const filteredTutees = someTutees.filter(tuteeFilter);

        // ASSERT
        assert.sameMembers(filteredTutees, matchingTutees);
    });

    // More complex combined restrictions
    it("More complex combined restrictions (for tutees)", function() {
        // ARRANGE
        const tuteeRestriction = createTuteeRestriction({
            blockingList: ["b1@example.org", "b2@example.org"],
            registrationDates: [
                {
                    min: new Date("2021-03-03")
                }
            ],
            matchingPriorities: [
                {
                    max: 424242
                }
            ]
        });

        const tuteeFilter = tuteeMatchingRestrictionFilter(tuteeRestriction);

        const matchingTutees = [
            createPupil({
                email: "bb1@example.org",
                matchingPriority: 424242,
                registrationDate: new Date("2021-03-10")
            }),
            createPupil({
                email: "t1@example.org",
                matchingPriority: -10,
                registrationDate: new Date("2021-03-09T10:30:52")
            }),
            createPupil({
                email: "t2@example.org",
                matchingPriority: 1000,
                registrationDate: new Date("2022-04-01")
            })
        ];

        const notMatchingTutees = [
            createPupil({
                email: "t3@example.org",
                matchingPriority: 9999999,
                registrationDate: new Date("2022-04-02")
            }),
            createPupil({
                email: "b1@example.org",
                registrationDate: new Date("2021-04-04"),
                matchingPriority: 0
            }),
            createPupil({
                email: "b2@example.org",
                registrationDate: new Date("2020-03-15"),
                matchingPriority: 424243
            }),
            createPupil({
                email: "t4@example.org",
                registrationDate: new Date("2020-04-16"),
                matchingPriority: 42
            })
        ];

        const someTutees = faker.helpers.shuffle([...matchingTutees, ...notMatchingTutees]);

        // ACT
        const filteredTutees = someTutees.filter(tuteeFilter);

        // ASSERT
        assert.sameMembers(filteredTutees, matchingTutees);
    });
});
