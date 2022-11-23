import { Server } from 'http';
import { getLogger } from 'log4js';
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as createUuid } from 'uuid';
import { getUserForSession, GraphQLUser } from '../../graphql/authentication';

type UserId = string;
type ClientId = string;

interface ExtendedWebsocket extends WebSocket {
    clientId: ClientId;
    userId: UserId;
}

type ConnectedClients = Map<UserId, Map<ClientId, ExtendedWebsocket>>;

type Message = {
    concreteNotificationId: number;
};

const log = getLogger();

class WebSocketService {
    private static instance: WebSocketService;
    private websocketServer: WebSocketServer;
    private connectedClients: ConnectedClients = new Map();

    private constructor(server: Server) {
        this.websocketServer = new WebSocketServer({ server, clientTracking: true });
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

    getCients(): ConnectedClients {
        return this.connectedClients;
    }

    private addClient(userId: string, connection: ExtendedWebsocket) {
        let userConnections = this.connectedClients.get(userId);
        if (!userConnections) {
            userConnections = new Map();
        }
        userConnections.set(connection.clientId, connection);
        this.connectedClients.set(userId, userConnections);
    }

    private removeClient(userId: string, clientId: string) {
        if (!this.connectedClients.has(userId) || !this.connectedClients.get(userId)?.has(clientId)) {
            log.error(`UserId or clientId not found in connected clients: ${[...this.connectedClients.entries()]}.`);
            return;
        }
        this.connectedClients.get(userId).delete(clientId);

        if (this.connectedClients.get(userId).size === 0) {
            this.connectedClients.delete(userId);
        }
    }

    private getClientsByUserId(userId: string): Map<ClientId, ExtendedWebsocket> | undefined {
        return this.connectedClients.get(userId);
    }

    /**
     * Sends a message to an websocket client
     * @param userId - user id
     * @param message - websocket message with notification id
     */
    sendMessageToClients(userId: string, message: Message): void {
        const clients = this.getClientsByUserId(userId);
        if (!clients) {
            throw new Error('Client not connected.');
        }
        for (let [_, client] of clients) {
            client.send(message, (err) => log.error(`Error while sending websocket message: ${err.message}`));
        }
    }

    /**
     * This could be used in the channel for canSend
     * @param userId - userId and identifier of the connection
     * @returns {boolean} online status indicating whether the user has an active websocket connection to get notified
     */
    isUserOnline(userId: string): boolean {
        return this.connectedClients.has(userId);
    }

    /**
     * initializes the events and handlers for the websocket server
     */
    configure(): void {
        this.websocketServer.on('connection', async (ws: ExtendedWebsocket, request) => {
            try {
                let sessionUser: GraphQLUser;

                if (request.headers['authorization'] && request.headers['authorization'].startsWith('Bearer ')) {
                    const sessionToken = request.headers['authorization'].slice('Bearer '.length);
                    log.debug(`Session token: ${sessionToken}`);

                    if (sessionToken.length < 20) {
                        throw new Error('Session Tokens must have at least 20 characters');
                    }

                    sessionUser = await getUserForSession(sessionToken);
                    log.debug(`Session user: ${JSON.stringify(sessionUser)}`);
                }
                const userId = getUserIdFromConnectionRequest(request.url);
                if (userId !== sessionUser.userID) {
                    throw new Error('Session user does not match user id from connection request parameter');
                }
                ws['userId'] = userId;
                // create client
                const clientId = createUuid();
                ws['clientId'] = clientId;
                this.addClient(userId, ws);
                log.info(`Connected websocket client with userId: ${userId} and clientId: ${clientId}`);
                log.debug(`Websocket users: ${[...this.getCients().keys()]}`);
                log.debug(`Websocket clients: ${JSON.stringify([this.getCients().values()])}`);
            } catch (err) {
                if (!!err?.message) {
                    log.error(`Error in websocket service: ${err.message}`);
                } else {
                    log.error(`Error in websocket service.`);
                }
                ws.terminate();
            }
            ws.on('close', () => {
                this.removeClient(ws.userId, ws.clientId);
                log.info(`Closing connection with id: ${ws.clientId}`);
                log.debug(`Connected user ids: ${[...this.getCients().keys()]}`);
            });
        });
    }
}

function getUserIdFromConnectionRequest(requestUrl: string | undefined) {
    // Looks a bit ugly but this is trimming the leading "/" in the request url
    const searchParams = new URLSearchParams(requestUrl.slice(1));
    if (!requestUrl || !searchParams.has('id')) {
        throw new Error(`Inavlid websocket connection request url: ${requestUrl}`);
    }
    const userId = searchParams.get('id');
    return userId;
}

export { WebSocketService };
