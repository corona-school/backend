import { AsyncLocalStorage } from 'async_hooks';
import { v4 as uuid } from 'uuid';

// A Session represents a long running interaction with the backend,
//  i.e. the GraphQL Session of a User using the User App
export interface Session {
    sessionID: string;
}

// Each user Session can have multiple transactions representing single requests,
//  i.e. a single GraphQL query
export interface Transaction {
    session?: Session;
    transactionID: string;
}

// We track transactions across asynchronous continuations:
const transactionStorage = new AsyncLocalStorage<Transaction>();

export function startTransaction(session?: Session) {
    const transactionID = uuid();
    const transaction: Transaction = { transactionID, session };

    transactionStorage.enterWith(transaction);
}

export function getCurrentTransaction(): Transaction | undefined {
    return transactionStorage.getStore();
}

export function attachSession(session: Session) {
    const transaction = transactionStorage.getStore();
    if (transaction) {
        if (transaction.session) {
            throw new Error(`Cannot attach two different sessions to the same transaction`);
        }
        transaction.session = session;
    }
}
