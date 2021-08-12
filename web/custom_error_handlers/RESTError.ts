
class RESTError extends Error {
    status: number;
    constructor(status, message) {
        super(status);
        this.name = "RESTError";
        this.status = status;
        this.message = "POST /expert/:id/contact failed with : "+message;
    }
}