# How to migrate with TypeORM

- Make sure your branch is up-to-date with branch dev
- Change branch to dev
- run command `npm run build:clean && npm run web:dev`. Your local db is now in target statet
- Change back to your branch
- Generate a migration file with the command `npm run db:migration:generate NAME_OF_MIGRATION`
- Check the generated file and delete unnecessary statements in up like `ALTER COLUMN "verification" SET DEFAULT null` 
and in down like `ALTER COLUMN "verification" DROP DEFAULT`

## Local testing
Comming soon...

See https://github.com/corona-school/backend/pull/114

