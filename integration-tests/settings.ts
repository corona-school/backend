import { test } from "./base";
import { pupilOne, studentOne } from "./user";


test("Student Settings", async () => {
    const { client } = await studentOne;

    // Student cannot set pupil settings
    await client.requestShallFail(
        `mutation SetPupilSettings { 
            meUpdate(update: { 
              pupil: { gradeAsInt: 1 }
          })
        }`
    );

    // Student can set subjects
    await client.request(`
        mutation SetSubjects {
            meUpdate(update: { 
                student: { 
                    subjects: { name: "Deutch", grade: { min: 1, max: 2 } }
                }
            })
        }
    `);

    // Student cannot set mandatory subjects
    await client.requestShallFail(`
        mutation SetMandatorySubject {
            meUpdate(update: { 
                student: { 
                    subjects: { name: "Deutch", grade: { min: 1, max: 2 }, mandatory: true }
                }
            })
        }
    `);
});

test("Pupil Settings", async () => {
    const { client } = await pupilOne;

    // Pupil cannot set student settings
    await client.requestShallFail(
        `mutation SetStudentSettings { 
            meUpdate(update: { 
              student: { subjects: [] }
          })
        }`
    );

    // Pupil can set subjects
    await client.request(`
        mutation SetSubject {
            meUpdate(update: { 
                pupil: { 
                    subjects: [{ name: "Deutsch" }]
                }
            })
        }
    `);

    // Pupil can set mandatory subjects
    await client.request(`
        mutation SetSubjectMandatory {
            meUpdate(update: { 
                pupil: { 
                    subjects: [{ name: "Deutsch", mandatory: true }]
                }
            })
        }
    `);

    // Pupil cannot set subject grades
    await client.requestShallFail(`
        mutation SetSubjectGrades {
            meUpdate(update: { 
                pupil: { 
                    subjects: [{ name: "Deutsch", grade: { min: 1, max: 2 } }]
                }
            })
        }
    `);
});