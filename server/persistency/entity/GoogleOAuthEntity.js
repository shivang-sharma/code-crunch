class GoogleOAuthEntity {
    #oauthUserId;
    #refreshToken;
    #userId;

    constructor(oauthUserId, refreshToken, userId) {
        this.#oauthUserId = oauthUserId;
        this.#refreshToken = refreshToken;
        this.#userId = userId;
    }
    
    get userId() {
        return this.#userId;
    }
    set userId(userId) {
        this.#userId=userId
    };
    get oauthUserId() {
        return this.#oauthUserId;
    }
    set oauthUserId(oauthUserId) {
        this.#oauthUserId=oauthUserId
    };
    get refreshToken() {
        return this.#refreshToken;
    }
    set refreshToken(refreshToken) {
        this.#refreshToken=refreshToken
    };
}
module.exports = {
    GoogleOAuthEntity: GoogleOAuthEntity
}