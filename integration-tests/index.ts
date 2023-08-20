/* ------------ GraphQL Integration Tests -----------------
  The tests defined in this folder require a running backend with a functioning database.
  They ensure that basic functionality of the GraphQL endpoint works and nothing breaks 'in serious ways'

  This can be run with 'npm run integration-tests', and by default runs against the dev backend.
  A different target can be configured by setting the INTEGRATION_TARGET environment */

import { finalizeTests } from './base';

/* Base Tests - Other tests build on them and they always must run */
import './01_user';
import './02_screening';
/* Feature Tests - These are independent and can be disabled */
import './03_matching';
import './04_certificate';

import './05_auth';
import './06_settings';
import './07_course';
import './08_appointments';
import './09_chat';
import './10_admin';
import './11_registerPlusMany';
/* Account Deactivation - Independent, but needs to be last */
import './12_deactivation';
import './13_redaction';

void finalizeTests();
