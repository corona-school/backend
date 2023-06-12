import { PrismaClient } from '@prisma/client';
import { isDev } from '../util/environment';

/* In the development environment, also log 'query'
   which is the SQL query sent to the database.
   Through that, queries can be optimized for performance */
export const prisma = new PrismaClient(!isDev ? undefined : { log: ['query', 'info', `warn`, `error`] });
