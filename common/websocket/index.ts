import { Server } from 'http';
import { getLogger } from 'log4js';
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as createUuid } from 'uuid';
import { getUserForSession, GraphQLUser } from '../../graphql/authentication';

type UserId = string;

type ConnectedClients = {
    [k: UserId]: WebSocket[];
};

type Message = {
    notificationId: string;
};

const log = getLogger();

class WebSocketService {
    private static instance: WebSocketService;
    private websocketServer: WebSocketServer;
    private connectedClients: ConnectedClients = {};

    constructor(server: Server) {
        if (WebSocketService.instance) {
            return WebSocketService.instance;
        }
        this.websocketServer = new WebSocketServer({ server, clientTracking: true });
    }

    public static getInstance(server?: Server) {
        if (!this.instance && !server) {
            throw new Error('No instance running and no instanciation possible without a server.');
        }
        if (!this.instance) {
            this.instance = new WebSocketService(server);
        }
        return this.instance;
    }

    getCients(): ConnectedClients {
        return this.connectedClients;
    }

    private addClient(userId: string, connection: WebSocket) {
        (this.connectedClients[userId] = this.connectedClients[userId] || []).push(connection);
    }

    private removeClient(id: string) {
        Object.keys(this.connectedClients).forEach((key) => {
            const idx = this.connectedClients[key].findIndex((ws: WebSocket & { clientId: string }) => ws.clientId === id);
            if (idx !== -1) {
                this.connectedClients[key].splice(idx, 1);
            }
            if (this.connectedClients[key].length === 0) {
                delete this.connectedClients[key];
            }
        });
        delete this.connectedClients[id];
    }

    private getClientsByUserId(userId: string): WebSocket[] {
        return this.connectedClients[userId];
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
        clients.forEach((client) => {
            client.send(message, (err) => log.error(`Error while sending websocket message: ${err.message}`));
        });
    }

    /**
     * This could be used in the channel for canSend
     * @param userId - userId and identifier of the connection
     * @returns {boolean} online status indicating whether the user has an active websocket connection to get notified
     */
    isUserOnline(userId: string): boolean {
        return !!this.connectedClients[userId];
    }

    /**
     * initializes the events and handlers for the websocket server
     */
    configure(): void {
        this.websocketServer.on('connection', async (ws: WebSocket & { clientId: string }, request) => {
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
                // create client
                ws['clientId'] = createUuid();
                this.addClient(userId, ws);
                log.info(`Connected websocket client with userId: ${userId}`);
                log.debug(`Websocket client ids: ${Object.keys(this.getCients())}`);
            } catch (err) {
                if (!!err?.message) {
                    log.error(`Error in websocket service: ${err.message}`);
                }
                log.error(`Error in websocket service.`);
                ws.terminate();
            }
            ws.on('close', () => {
                this.removeClient(ws.clientId);
                log.info(`Closing connection with id: ${ws.clientId}`);
                log.debug(`Connected user ids: ${Object.keys(this.getCients())}`);
            });
        });
    }
}

function getUserIdFromConnectionRequest(requestUrl: string | undefined) {
    const idQueryParam = '?id=';
    if (!requestUrl || requestUrl?.split(idQueryParam).length !== 2) {
        throw new Error(`Inavlid websocket connection request url: ${requestUrl}`);
    }
    const urlParams = requestUrl.split(idQueryParam);
    return urlParams[1];
}

export { WebSocketService };
