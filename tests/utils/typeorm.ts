//Based on this:
//https://github.com/typeorm/typeorm/blob/master/test/utils/test-utils.ts

import {
    Connection,
    EntitySchema,
    createConnections,
    NamingStrategyInterface
} from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const TEST_ORM_CONFIG_FILE = `../ormconfig.test.js`;

/**
 * Interface in which data is stored in ormconfig.test.js of the project.
 */
export type TestingConnectionOptions = PostgresConnectionOptions & {
    /**
     * Indicates if this connection should be skipped.
     */
    skip?: boolean;
};

/**
 * Options used to create a connection for testing purposes.
 */
export interface TestingOptions {
    /**
     * Connection name to be overridden.
     * This can be used to create multiple connections with single connection configuration.
     */
    name?: string;

    /**
     * Entities needs to be included in the connection for the given test suite.
     */
    entities?: (string | Function | EntitySchema<any>)[];

    /**
     * Migrations needs to be included in connection for the given test suite.
     */
    migrations?: string[];

    /**
     * Subscribers needs to be included in the connection for the given test suite.
     */
    subscribers?: string[] | Function[];

    /**
     * Indicates if schema sync should be performed or not.
     */
    schemaCreate?: boolean;

    /**
     * Indicates if schema should be dropped on connection setup.
     */
    dropSchema?: boolean;

    /**
     * Enables or disables logging.
     */
    logging?: boolean;

    /**
     * Schema name used for postgres driver.
     */
    schema?: string;

    /**
     * Naming strategy defines how auto-generated names for such things like table name, or table column gonna be
     * generated.
     */
    namingStrategy?: NamingStrategyInterface;
}

/**
 * Creates a testing connection options from the ormconfig.json
 * and given options that can override some of its configuration for the test-specific use case.
 */
export function setupSingleTestingConnection(
    options: TestingOptions
): PostgresConnectionOptions | undefined {
    const testingConnections = setupTestingConnections({
        name: options.name ? options.name : undefined,
        entities: options.entities ? options.entities : [],
        subscribers: options.subscribers ? options.subscribers : [],
        dropSchema: options.dropSchema ? options.dropSchema : false,
        schemaCreate: options.schemaCreate ? options.schemaCreate : false,
        schema: options.schema ? options.schema : undefined,
        namingStrategy: options.namingStrategy
            ? options.namingStrategy
            : undefined
    });
    if (!testingConnections.length) {
        return undefined;
    }

    return testingConnections[0];
}

/**
 * Loads test connection options from ormconfig.test.js file.
 */
export function getTypeOrmConfig(): TestingConnectionOptions[] {
    try {
        try {
            return require(TEST_ORM_CONFIG_FILE);
        } catch (err) {
            return require(TEST_ORM_CONFIG_FILE);
        }
    } catch (err) {
        throw new Error(
            `Cannot find ${TEST_ORM_CONFIG_FILE} file in the root of the project. To run tests please create ${TEST_ORM_CONFIG_FILE} file` +
                ` in the root of the project and change all database settings to match your local test environment settings).`
        );
    }
}

/**
 * Creates a testing connections options based on the configuration in the ormconfig.test.js
 * and given options that can override some of its configuration for the test-specific use case.
 */
export function setupTestingConnections(
    options?: TestingOptions
): PostgresConnectionOptions[] {
    const ormConfigConnectionOptionsArray = getTypeOrmConfig();

    if (!ormConfigConnectionOptionsArray.length) {
        throw new Error(
            `No connections setup in ${TEST_ORM_CONFIG_FILE} file. Please create configurations for the postgres database that should be used.`
        );
    }

    return ormConfigConnectionOptionsArray
        .filter((connectionOptions) => {
            if (connectionOptions.skip === true) {
                return false;
            }

            return true;
        })
        .map((connectionOptions) => {
            if (!options) {
                //if no options to override are given...
                return Object.assign(
                    {},
                    connectionOptions as PostgresConnectionOptions
                );
            }

            let newOptions: any = Object.assign(
                {},
                connectionOptions as PostgresConnectionOptions,
                {
                    name: options.name ? options.name : connectionOptions.name,
                    entities: options.entities
                        ? options.entities
                        : connectionOptions.entities,
                    migrations: options.migrations
                        ? options.migrations
                        : connectionOptions.migrations,
                    subscribers: options.subscribers
                        ? options.subscribers
                        : connectionOptions.subscribers,
                    dropSchema:
                        options.dropSchema !== undefined
                            ? options.dropSchema
                            : connectionOptions.dropSchema,
                    synchronize:
                        options.schemaCreate !== undefined
                            ? options.schemaCreate
                            : connectionOptions.synchronize,
                    schema: options.schema
                        ? options.schema
                        : connectionOptions.schema,
                    logging:
                        options.logging !== undefined
                            ? options.logging
                            : connectionOptions.logging,
                    namingStrategy: options.namingStrategy
                        ? options.namingStrategy
                        : connectionOptions.namingStrategy
                }
            );

            return newOptions;
        });
}

/**
 * Creates a testing connections based on the configuration in the ormconfig.test.js
 * and given options that can override some of its configuration for the test-specific use case.
 */
export async function createTestingConnections(
    options?: TestingOptions
): Promise<Connection[]> {
    const connections = await createConnections(
        setupTestingConnections(options)
    );
    await Promise.all(
        connections.map(async (connection) => {
            // create new databases
            const databases: string[] = [];
            connection.entityMetadatas.forEach((metadata) => {
                if (
                    metadata.database &&
                    databases.indexOf(metadata.database) === -1
                ) { databases.push(metadata.database); }
            });

            const queryRunner = connection.createQueryRunner();
            for (const database of databases) {
                await queryRunner.createDatabase(database, true);
            }

            // create new schemas
            const schemaPaths: string[] = [];
            connection.entityMetadatas
                .filter((entityMetadata) => !!entityMetadata.schemaPath)
                .forEach((entityMetadata) => {
                    const existSchemaPath = schemaPaths.find(
                        (path) => path === entityMetadata.schemaPath
                    );
                    if (!existSchemaPath) {
                        schemaPaths.push(entityMetadata. schemaPath!);
                    }
                });

            const schema = connection.driver.options["schema"];
            if (schema && schemaPaths.indexOf(schema) === -1) {
                schemaPaths.push(schema);
            }

            for (const schemaPath of schemaPaths) {
                await queryRunner.createSchema(schemaPath, true);
            }

            await queryRunner.release();
        })
    );

    return connections;
}

export async function createTestingConnection(
    options?: TestingOptions
): Promise<Connection> {
    return (await createTestingConnections(options))[0];
}

/**
 * Closes testing connections if they are connected.
 */
export function closeTestingConnections(connections: Connection[]) {
    return Promise.all(
        connections.map((connection) =>
            connection && connection.isConnected
                ? connection.close()
                : undefined
        )
    );
}
export function closeTestingConnection(connection: Connection) {
    return closeTestingConnections([connection]);
}

/**
 * Reloads all databases for all given connections.
 */
export function reloadTestingDatabases(connections: Connection[]) {
    return Promise.all(
        connections.map((connection) => connection.synchronize(true))
    );
}

/**
 * Generates random text array with custom length.
 */
export function generateRandomText(length: number): string {
    let text = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i <= length; i++) {
        text += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }

    return text;
}

export function sleep(ms: number): Promise<void> {
    return new Promise<void>((ok) => {
        setTimeout(ok, ms);
    });
}
