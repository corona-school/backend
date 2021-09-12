
export class ServiceError extends Error {
    type: errorType;
    constructor(type, message) {
        super(type);
        this.name = "ServiceError";
        this.type = type;
        this.message = message;
    }

    getRESTStatusCode() {
        switch (this.type) {
            case "invalidRequest": return 400;
            case "improperParameters": return 400;
            case "unauthorisedOrigin": return 401;
            case "forbidden": return 403;
            default: return 500;
        }
    }
}


enum errorType{
    invalidRequest="invalidRequest",
    improperParameters = "improperParameters",
    unauthorisedOrigin = "unauthorisedOrigin",
    forbidden = "forbidden"
}

