/* ------------ GraphQL Integration Tests -----------------
  The tests defined in this folder require a running backend with a functioning database.
  They ensure that basic functionality of the GraphQL endpoint works and nothing breaks 'in serious ways'

  This can be run with 'npm run integration-tests', and by default runs against the dev backend.
  A different target can be configured by setting the INTEGRATION_TARGET environment */

import { finalizeTests } from "./base";


/* Base Tests - Other tests build on them and they always must run */
import "./user";
import "./screening";
/* Feature Tests - These are independent and can be disabled */
import "./matching";
import "./auth";
import "./settings";
import "./course";

/* Account Deactivation - Independent, but needs to be last */
import "./deactivation";

finalizeTests();