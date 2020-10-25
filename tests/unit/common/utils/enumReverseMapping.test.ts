import {assert} from "chai";
import { SchoolType } from "../../../../common/entity/SchoolType";
import { State } from "../../../../common/entity/State";
import { MentoringCategory } from "../../../../common/mentoring/categories";
import { EnumReverseMappings } from "../../../../common/util/enumReverseMapping";


describe("Enum Reverse Mappings", function() {
    this.timeout(5000);


    it("State enum", function() {
        const reverseMapping = EnumReverseMappings.State;

        const stateValues = Object.values(State);

        stateValues.forEach(s => {
            assert.strictEqual(State[s.toUpperCase()], reverseMapping(s));
        });

        assert.strictEqual(State["BW"], reverseMapping("bw"));
    });

    it("SchoolType enum", function() {
        const reverseMapping = EnumReverseMappings.SchoolType;

        assert.strictEqual(reverseMapping("grundschule"), SchoolType.GRUNDSCHULE);
        assert.strictEqual(reverseMapping("gesamtschule"), SchoolType.GESAMTSCHULE);
        assert.strictEqual(reverseMapping("hauptschule"), SchoolType.HAUPTSCHULE);
        assert.strictEqual(reverseMapping("realschule"), SchoolType.REALSCHULE);
        assert.strictEqual(reverseMapping("gymnasium"), SchoolType.GYMNASIUM);
        assert.strictEqual(reverseMapping("förderschule"), SchoolType.FOERDERSCHULE);
        assert.strictEqual(reverseMapping("berufsschule"), SchoolType.BERUFSSCHULE);
        assert.strictEqual(reverseMapping("other"), SchoolType.SONSTIGES);

        assert.isUndefined(reverseMapping("otherExpectedToBeUndefined"));
    });

    it("MentoringCategory enum", function() {
        const reverseMapping = EnumReverseMappings.MentoringCategory;

        const categoryValues: MentoringCategory[] = [];
        for (const v of Object.values(MentoringCategory)) { // no use of filter, cause this does not really infers the type
            if (typeof v === "string") {
                categoryValues.push(v);
            }
        }

        categoryValues.forEach(v => {
            assert.strictEqual(MentoringCategory[v.toUpperCase()], reverseMapping(v));
        });
    });
});
