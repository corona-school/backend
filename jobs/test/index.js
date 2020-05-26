import test from "tape";

// import tests here
import matching from "./backend/matching";
import utils from "./backend/utils";
import security from "./backend/security";

// run tests here
test("matching", matching);
test("utils", utils);
test("security", security);
