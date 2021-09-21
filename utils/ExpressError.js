class ExpressError extends Error {
    constructor(name, statusCode){
        super();
        this.name = name;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;