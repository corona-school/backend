import {
    intersectionWithRespectToGrade,
    convertToSubjectWithGradeDetail,
} from "../../backend/matching";

export default function (t) {
    t.test("intersection with respect to grade", async (t) => {
        t.test("Grade out of student's bounds", (t) => {
            t.plan(2);
            t.deepEqual(
                intersectionWithRespectToGrade(
                    ["Mathematik5:13", "Englisch1:13", "Physik5:13"],
                    ["Mathematik", "Englisch"],
                    14
                ),
                []
            );
            t.deepEqual(
                intersectionWithRespectToGrade(
                    ["Mathematik5:13", "Englisch1:13", "Physik5:13"],
                    ["Mathematik", "Englisch"],
                    0
                ),
                []
            );
        });

        t.test("Grade iin student's bounds", (t) => {
            t.plan(3);
            t.deepEqual(
                intersectionWithRespectToGrade(
                    ["Mathematik5:13", "Englisch1:13", "Physik5:13"],
                    ["Mathematik", "Englisch"],
                    13
                ),
                ["Mathematik", "Englisch"]
            );
            t.deepEqual(
                intersectionWithRespectToGrade(
                    ["Mathematik5:13", "Englisch1:13", "Physik5:13"],
                    ["Mathematik", "Englisch"],
                    6
                ),
                ["Mathematik", "Englisch"]
            );
            t.deepEqual(
                intersectionWithRespectToGrade(
                    ["Mathematik5:13", "Englisch1:13", "Physik5:13"],
                    ["Mathematik", "Englisch"],
                    2
                ),
                ["Englisch"]
            );
        });
    });

    t.test("Intersection without grades", async (t) => {
        t.test("Intersection without grades", (t) => {
            t.plan(3);
            t.deepEqual(
                intersectionWithRespectToGrade(
                    ["Mathematik", "Englisch", "Physik"],
                    ["Latein", "Chemie"],
                    11
                ),
                []
            );
            t.deepEqual(
                intersectionWithRespectToGrade(
                    ["Mathematik", "Englisch", "Physik"],
                    ["Englisch", "Physik"],
                    11
                ),
                ["Englisch", "Physik"]
            );
            t.deepEqual(
                intersectionWithRespectToGrade(
                    ["Mathematik", "Englisch", "Physik"],
                    ["Englisch", "Latein"],
                    11
                ),
                ["Englisch"]
            );
        });
    });

    t.test("#Extended Grade to grade detail", async (t) => {
        t.test("Simple tests...", (t) => {
            t.plan(3);
            t.deepEqual(convertToSubjectWithGradeDetail("Mathematik"), {
                name: "Mathematik",
                grade: null,
            });
            t.deepEqual(convertToSubjectWithGradeDetail("Mathematik1:3"), {
                name: "Mathematik",
                grade: { lower: 1, upper: 3 },
            });
            t.deepEqual(convertToSubjectWithGradeDetail("Chemie10:19"), {
                name: "Chemie",
                grade: { lower: 10, upper: 19 },
            });
        });
    });
}
