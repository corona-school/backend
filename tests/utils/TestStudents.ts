import { Student } from "../../common/entity/Student";

function generateMax() {
    const s = new Student();
    s.wix_creation_date = new Date();
    s.firstname = "Max";
    s.lastname = "Mustermann";
    s.active = true;
    s.email = "test+dev+s@lern-fair.de";
    s.wix_id =
        "TEST_WIX_ID_ÖKJSÖDF83-A39ASFASD83RAFSD-LAÖSDÜF9AUÖ3ASDÖFA-A-DSFLAHSDF";
    s.subjects = `["Deutsch7:29", "Englisch1:12"]`;

    return s;
}

export default {
    max: generateMax
};
