import { Server } from 'http';
import { getLogger } from 'log4js';
import { WebSocketServer, WebSocket } from 'ws';

// can also be any kind of authkey
type UserId = string;

type ConnectedClients = {
    [k: UserId]: WebSocket;
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

    private addClient(id: string, connection: WebSocket) {
        this.connectedClients[id] = connection;
    }

    private removeClient(id: string) {
        delete this.connectedClients[id];
    }

    private getClientByConnectionId(id: string): WebSocket {
        return this.connectedClients[id];
    }

    /**
     * Sends a message to an websocket client
     * @param id - client id
     * @param message - websocket message with notification id
     */
    sendMessageToClient(id: string, message: Message): void {
        const client = this.getClientByConnectionId(id);
        if (!client) {
            throw new Error('Client not connected.');
        }
        client.send(message, (err) => log.error(`Error while sending websocket message: ${err.message}`));
    }

    /**
     * This could be used in the channel for canSend
     * @param id - userId and identifier of the connection
     * @returns {boolean} online status indicating whether the user has an active websocket connection to get notified
     */
    isClientOnline(id: string): boolean {
        return !!this.connectedClients[id];
    }

    /**
     * initializes the events and handlers for the websocket server
     */
    configure(): void {
        this.websocketServer.on('connection', (ws: WebSocket & { id: string }, request) => {
            try {
                // We should do some kind of auth check here, so that the token in the header matches the param
                // otherwise some user could get the notifications of otherones just by sending the request with another userIds
                const id = getUserIdFromConnectionRequest(request.url);
                ws['id'] = id;
                this.addClient(id, ws);
                log.info(`Connected websocket client with id: ${id}`);
                log.debug(`Websocket client ids: ${Object.keys(this.getCients())}`);
            } catch (err) {
                if (!!err?.message) {
                    log.error(`Error in websocket service: ${err.message}`);
                }
                log.error(`Error in websocket service.`);
                ws.terminate();
            }
            ws.on('close', () => {
                this.removeClient(ws.id);
                log.info(`Closing connection with id: ${ws.id}`);
                log.debug(`Connected client ids: ${Object.keys(this.getCients())}`);
            });
        });
    }
}

function getUserIdFromConnectionRequest(requestUrl: string | undefined) {
    if (!requestUrl || requestUrl?.split('/').length !== 2) {
        throw new Error(`Inavlid websocket connection request url: ${requestUrl}`);
    }
    const urlParams = requestUrl.split('/');
    return urlParams[1];
}

export { WebSocketService };
