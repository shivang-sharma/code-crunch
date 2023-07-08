class UserEntity {
    #userId;
    #username;
    #firstName;
    #lastName;
    #userEmail;
    #userPassword;
    #profilePhotoURL;
    #authMechanism;

    constructor(userId = null) {
        this.#userId = userId;
    }

    get userId() {
        return this.#userId;
    }
    set userId(userId) {
        this.#userId = userId
    };
    get username() {
        return this.#username;
    }
    set username(username) {
        this.#username = username
    };
    get firstName() {
        return this.#firstName;
    }
    set firstName(firstName) {
        this.#firstName = firstName
    };
    get lastName() {
        return this.#lastName;
    }
    set lastName(lastName) {
        this.#lastName = lastName
    };
    get userEmail() {
        return this.#userEmail;
    }
    set userEmail(userEmail) {
        this.#userEmail = userEmail
    };
    get userPassword() {
        return this.#userPassword;
    }
    set userPassword(userPassword) {
        this.#userPassword = userPassword
    };
    get profilePhotoURL() {
        return this.#profilePhotoURL;
    }
    set profilePhotoURL(profilePhotoURL) {
        this.#profilePhotoURL = profilePhotoURL
    };
    get authMechanism() {
        return this.#authMechanism;
    }
    set authMechanism(authMechanism) {
        this.#authMechanism = authMechanism
    };
    toJSON() {
        return {
            userId:this.#userId,
            username:this.#username,
            firstName:this.#firstName,
            lastName:this.#lastName,
            userEmail:this.#userEmail,
            userPassword:this.#userPassword,
            profilePhotoURL:this.#profilePhotoURL,
            authMechanism:this.#authMechanism,
        }
    }

}
module.exports = {
    UserEntity: UserEntity
}