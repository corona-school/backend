import { Server } from 'http';
import { getLogger } from '../../common/logger/logger';
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as createUuid } from 'uuid';
import { getUserForSession, GraphQLUser } from '../user/session';
type UserId = string;
type ConnectionId = string;

enum CloseCodes {
    NORMAL = 1000,
    SERVER_ERROR = 1011,
}

interface ExtendedWebsocket extends WebSocket {
    connectionId: ConnectionId;
    userId: UserId;
    isAlive: boolean;
}

type Connections = Map<ConnectionId, ExtendedWebsocket>;

type ConnectedUsers = Map<UserId, Connections>;

export type Message = {
    concreteNotificationId: number;
};

const log = getLogger('Websockets');

class WebSocketService {
    private static instance: WebSocketService;
    private websocketServer: WebSocketServer;
    private connectedUsers: ConnectedUsers = new Map();

    private constructor(server: Server) {
        this.websocketServer = new WebSocketServer({ server, clientTracking: true });
    }

    public static hasInstance(): boolean {
        return !!this.instance;
    }

    public static getInstance(server?: Server) {
        if (!this.instance && !server) {
            throw new Error('No instance running and no instantiation possible without a server.');
        }
        if (!this.instance) {
            this.instance = new WebSocketService(server);
        }
        return this.instance;
    }

    getConnectedUsers(): ConnectedUsers {
        return this.connectedUsers;
    }

    private addConnection(userId: string, connection: ExtendedWebsocket) {
        let userConnections = this.connectedUsers.get(userId);
        if (!userConnections) {
            userConnections = new Map();
        }
        userConnections.set(connection.connectionId, connection);
        this.connectedUsers.set(userId, userConnections);
    }

    private removeConnection(userId: string, connectionId: string) {
        if (!this.connectedUsers.has(userId) || !this.connectedUsers.get(userId)?.has(connectionId)) {
            log.error('UserId or clientId not found in connected clients.', new Error('UserId or clientId not found in connected clients.'));
            return;
        }
        this.connectedUsers.get(userId).delete(connectionId);

        if (this.connectedUsers.get(userId).size === 0) {
            this.connectedUsers.delete(userId);
        }
    }

    private getConnectionsByUserId(userId: string): Map<ConnectionId, ExtendedWebsocket> | undefined {
        return this.connectedUsers.get(userId);
    }

    private logConnections() {
        const connections = {};
        this.getConnectedUsers().forEach((connection, userid) => (connections[userid] = [...connection.keys()]));

        log.debug(`Connected user ids: ${[...this.getConnectedUsers().keys()]}`);
        log.debug('Websocket connections: ', { connections: JSON.stringify(connections) });
    }

    /**
     * Sends a message to all websocket clients of a user that are connected
     * @param userId - user id
     * @param message - websocket message with notification id
     */
    async sendMessageToUser(userId: string, message: Message): Promise<void> {
        try {
            const connections = this.getConnectionsByUserId(userId);
            if (!connections) {
                throw new Error(`No connections found for user with userId: ${userId}`);
            }
            for (const [_, connection] of connections) {
                await new Promise<void>((resolve, reject) => {
                    connection.send(JSON.stringify(message), (err?: Error) => {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    });
                });
            }
        } catch (err) {
            log.error('Error while sending websocket message', err);
        }
    }

    /**
     * This could be used in the channel for canSend
     * @param userId - userId and identifier of the connection
     * @returns {boolean} online status indicating whether the user has an active websocket connection to get notified
     */
    isUserOnline(userId: string): boolean {
        return this.connectedUsers.has(userId);
    }

    private getAllClients(): ExtendedWebsocket[] {
        let clients: ExtendedWebsocket[] = [];
        for (let [_, connections] of this.connectedUsers) {
            clients = [...clients, ...Array.from(connections.values())];
        }
        return clients;
    }

    private pingClients(): void {
        const allClients = this.getAllClients();
        allClients.forEach(function each(client) {
            if (!client.isAlive) {
                log.info(`Terminating websocket cient with ConnectionId(${client.connectionId}) of User UserId(${client.userId})}`);
                client.terminate();
                return;
            }
            client.isAlive = false;
            log.debug(`Pinging client with ConnectionId(${client.connectionId}) of User UserId(${client.userId})}`);
            client.ping();
        });
    }

    /**
     * initializes the events and handlers for the websocket server
     */
    configure(): void {
        this.websocketServer.on('connection', async (ws: ExtendedWebsocket, request) => {
            try {
                let sessionUser: GraphQLUser;

                const { userId, sessionToken } = getParamsFromConnectionRequest(request.url);
                log.debug(`Session token: ${sessionToken}`);
                if (sessionToken.length < 20) {
                    throw new Error('Session Tokens must have at least 20 characters');
                }
                sessionUser = await getUserForSession(sessionToken);
                if (!sessionUser) {
                    throw new Error(`Invalid Session Token`);
                }

                if (userId !== sessionUser.userID) {
                    throw new Error('Session user does not match user id from connection request parameter');
                }

                ws['userId'] = userId;
                // create client
                const connectionId = createUuid();
                ws['connectionId'] = connectionId;
                ws['isAlive'] = true;
                this.addConnection(userId, ws);
                log.info(`Connected websocket client with userId: ${userId} and connectionId: ${connectionId}`);
                this.logConnections();
            } catch (err) {
                log.error('Error in websocket service.', err);
                ws.close(CloseCodes.SERVER_ERROR, err?.message ?? 'Internal server error while operating');
            }

            ws.on('pong', () => {
                log.debug(`Received pong from ConnectionId(${ws.connectionId}) of user UserId(${ws.userId})}`);
                ws.isAlive = true;
            });

            ws.on('close', () => {
                this.removeConnection(ws.userId, ws.connectionId);
                log.info(`Closing connection with id: ${ws.connectionId}`);
                this.logConnections();
            });
        });

        setInterval(() => this.pingClients(), 30_000);
    }
}

function getParamsFromConnectionRequest(requestUrl: string | undefined): { sessionToken: string; userId: string } {
    // Looks a bit ugly but this is trimming the leading "/" in the request url
    const searchParams = new URLSearchParams(requestUrl.slice(1));
    if (!requestUrl || !searchParams.has('id') || !searchParams.has('token')) {
        throw new Error(`Invalid websocket connection request url: ${requestUrl}`);
    }
    const userId = searchParams.get('id');
    const sessionToken = searchParams.get('token');
    return { sessionToken, userId };
}

export { WebSocketService };
