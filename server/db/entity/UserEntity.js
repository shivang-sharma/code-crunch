class UserEntity {
    #userId;
    #username;
    #userEmail;
    #userPassword;

    constructor(userId, username, userEmail, userPassword) {
        this.#userId = userId;
        this.#username = username;
        this.#userEmail = userEmail;
        this.#userPassword = userPassword;
    }

    get userId() {
        return this.#userId;
    }
    get username() {
        return this.#username;
    }
    get userEmail() {
        return this.#userEmail;
    }
    get userPassword() {
        return this.#userPassword;
    }
}
module.exports = {
    UserEntity: UserEntity
}