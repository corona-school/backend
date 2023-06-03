import { PrismaClient } from '@prisma/client';

/* In the development environment, also log 'query'
   which is the SQL query sent to the database.
   Through that, queries can be optimized for performance */
export const prisma = new PrismaClient(
    process.env.ENV !== 'dev' || process.env.LOG_FORMAT === 'brief' ? undefined : { log: ['query', 'info', `warn`, `error`] }
);
