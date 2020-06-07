import { EntityManager } from "typeorm";

// A type that all jobs scheduled in the Corona School backend must be of
export type CSJob = (manager?: EntityManager) => Promise<void>;
//Define a type that is used to define Corona School Cron Jobs that the scheduler accepts
export type CSCronJob = { cronTime: string, jobFunction: CSJob};