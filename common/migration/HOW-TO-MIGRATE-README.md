# How to migrate with TypeORM
This Readme will shortly explain how to create database migrations for model changes introduced by a new branch (hereinafter referred to as "target branch").

## Prerequisites
It is necessary to have a local postgres database for development with the credentials stored in the corresponding environment variables when creating the migrations. This database is later used to store the state of the `master` branch which is then compared by TypeORM to the state on the target branch.

## Steps
You'll need to perform the following steps to use TypeORM's auto generation feature for migrations: 

- Make sure your branch is up-to-date with remote branch `master`
- Change your local branch to `master`
- Run command `npm run build:clean && npm run web:dev`. Your local db is now in the state defined by the current code on the `master` branch.
- Change back to your target branch
- Generate a migration file with the command `npm run db:migration:generate NAME_OF_MIGRATION` where _NAME_OF_MIGRATION_ is a simple and short description of what the new migration should do. 
- Check the generated file and delete unnecessary statements in _up_ like `ALTER COLUMN "verification" SET DEFAULT null` 
and in _down_ like `ALTER COLUMN "verification" DROP DEFAULT` (please also see https://github.com/typeorm/typeorm/issues/3076)

## Local testing
Comming soon...

See https://github.com/corona-school/backend/pull/114

