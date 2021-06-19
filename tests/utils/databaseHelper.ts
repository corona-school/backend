import {closeTestingConnection, createTestingConnection} from "./typeorm";
import {Connection} from "typeorm";

/**
 * Creates a connection to the test database and creates the required tables
 * @param [dropSchema=true] Reset database before each test, default is true
 * @return The promise with the connection as resolve parameter
 */
function createConnection(dropSchema: boolean = true): Promise<Connection> {
    return new Promise((resolve, reject) => {
        createTestingConnection({
            name: "default", //use the default name, because the function that we wanna test use the getConnection function
            dropSchema: dropSchema
        }).then(connection => {
            // create tables etc.
            connection.synchronize().then(() => {
                resolve(connection);
            })
                .catch(err => {
                    reject(err);
                });
        })
            .catch(err => {
                reject(err);
            });
    });
}

/**
 * Drops the database and all its tables and close the connection
 * @param connection The connection object of the database
 * @return A promise which resolves when the database was stopped
 */
function closeConnection(connection: Connection): Promise<void | Error> {
    return new Promise((resolve, reject) => {
        connection.dropDatabase().then(() => {
            closeTestingConnection(connection).then(() => {
                resolve();
            })
                .catch(err => {
                    reject(err);
                });
        })
            .catch(err => {
                reject(err);
            });
    });
}

export default {
    createConnection: createConnection,
    closeConnection: closeConnection
};
