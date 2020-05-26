module.exports = [
    {
        name: "default",
        type: "postgres",
        host: "localhost",
        port: 5432,
        database: "coronaschool-test",
        username: "coronaschool",
        password: "coronanervt",
        logging: false,
        entities: [
            __dirname + "/../common/entity/*.ts", //IMPORTANT: use the .ts files here, because we're testing using jest and ts-jest -> that means, that we're using the typescript files instead of the compiled files
        ],
        subscribers: [__dirname + "/../common/subscriber/*.ts"],
        migrations: [__dirname + "/../common/migration/*.ts"],
        cli: {
            entitiesDir: __dirname + "/../common/entity",
            migrationsDir: __dirname + "/../common/migration",
            subscribersDir: __dirname + "/../common/subscriber",
        },
    },
];
