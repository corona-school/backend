module.exports = {
    name: 'default',
    type: 'postgres',
    url: 'postgres://postgres@localhost:5432/coronaschool-dev',
    // url: process.env.DATABASE_URL,
    logging: false,
    entities: ['./built/common/entity/*.js'],
    subscribers: ['./built/common/subscriber/*.js'],
    migrations: ['./built/common/migration/*.js'],
    cli: {
        //the output directories for the CLI are different from the directories where the builded files are
        entitiesDir: './common/entity',
        migrationsDir: './common/migration',
        subscribersDir: './common/subscriber',
    },
};
