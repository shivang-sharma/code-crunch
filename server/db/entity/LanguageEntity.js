class LanguageEntity {
    #languageId;    
    #languageName;
    #languageSandbox;

    constructor(languageId, languageName, languageSandbox) {
        this.#languageId = languageId;
        this.#languageName = languageName;
        this.#languageSandbox = languageSandbox;
    }

    get languageId() {
        return this.#languageId;
    }
    get languageName() {
        return this.#languageName;
    }
    get languageSandbox() {
        return this.#languageSandbox;
    }
}
module.exports = {
    LanguageEntity: LanguageEntity
}