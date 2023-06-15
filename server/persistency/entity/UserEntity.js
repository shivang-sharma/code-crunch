class UserEntity {
    #userId;
    #username;
    #userEmail;
    #userPassword;

    constructor(userId=null) {
        this.#userId = userId;
    }
    
    get userId() {
        return this.#userId;
    }
    set userId(userId) {
        this.#userId=userId
    };
    get username() {
        return this.#username;
    }
    set username(username) {
        this.#username=username
    };
    get userEmail() {
        return this.#userEmail;
    }
    set userEmail(userEmail) {
        this.#userEmail=userEmail
    };
    get userPassword() {
        return this.#userPassword;
    }
    set userPassword(userPassword) {
        this.#userPassword=userPassword
    };
    // get json() {
    //     return {
    //         userId: this.#userId,
    //         userEmail: this.#userEmail,
    //         username: this.#username,
    //         userPassword:this.#userPassword
    //     }
    // }
}
module.exports = {
    UserEntity: UserEntity
}