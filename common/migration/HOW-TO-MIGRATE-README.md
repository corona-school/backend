# How to migrate with TypeORM

- Make sure your branch is up-to-date with branch master
- Generate a migration file with the command `npm run db:migration:generate NAME_OF_MIGRATION`
- Check the generated file and delete unnecessary statements in up and down like `ALTER COLUMN "verification" SET DEFAULT null`

## Local testing
Comming soon...

See https://github.com/corona-school/backend/pull/114

