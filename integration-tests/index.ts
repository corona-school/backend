/* ------------ GraphQL Integration Tests -----------------
  The tests defined in this folder require a running backend with a functioning database.
  They ensure that basic functionality of the GraphQL endpoint works and nothing breaks 'in serious ways'

  This can be run with 'npm run integration-tests', and by default runs against the dev backend.
  A different target can be configured by setting the INTEGRATION_TARGET environment */

import 'reflect-metadata';
import { finalizeTests, logger } from './base';
/* Base Tests - Other tests build on them and they always must run */
import './01_user';
import './02_screening';
/* Feature Tests - These are independent and can be disabled */
import './03_matching';

try {
    // Try loading PDF rendering
    require('html-pppdf');
    // If that worked, also run the tests related to it
    require('./04_certificate');
} catch (error) {
    // If not, ignore the tests
    logger.failure('Skipped Certificate Test as PDF Rendering is not supported');
}

import './05_auth';
import './06_settings';
import './07_course';
import './08_appointments';
import './09_chat';
import './10_admin';
import './12_notifications';
/* Account Deactivation - Independent, but needs to be last */
import './13_deactivation';
import './14_redaction';
import './15_achievements';

void finalizeTests();
