import { gradeAsInt } from "../../backend/utils";

export default function (t) {
    t.test("# Grade to Int", async (t) => {
        t.test("Simple cases", (t) => {
            t.plan(3);
            t.deepEqual(gradeAsInt("13. Klasse"), 13);
            t.deepEqual(gradeAsInt("10. Klasse"), 10);
            t.deepEqual(gradeAsInt("2. Klasse"), 2);
        });
    });
}
