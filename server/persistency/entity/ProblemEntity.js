class ProblemEntity {
    #problemId;
    #problemName;
    #problemDescription;
    #problemTestCase;
    #problemTimeout;
    #problemDifficulty; // IN('EASY', 'MEDIUM', 'HARD'),
    #problemAcceptance;
    #problemTemplate;
    constructor(problemId, problemName, problemDescription, problemTestCase, problemTimeout, problemDifficulty, problemAcceptance, problemTemplate) {
        this.#problemId = problemId;
        this.#problemName = problemName;
        this.#problemDescription = problemDescription;
        this.#problemTestCase = problemTestCase;
        this.#problemTimeout = problemTimeout;
        this.#problemDifficulty = problemDifficulty;
        this.#problemAcceptance = problemAcceptance;
        this.#problemTemplate = problemTemplate;
    }

    get problemId() {
        return this.#problemId;
    }
    get problemName() {
        return this.#problemName;
    }
    get problemDescription() {
        return this.#problemDescription;
    }
    get problemTestCase() {
        return this.#problemTestCase;
    }
    get problemTimeout() {
        return this.#problemTimeout;
    }
    get problemDifficulty() {
        return this.#problemDifficulty;
    }
    get problemAcceptance() {
        return this.#problemAcceptance;
    }
    get problemTemplate() {
        return this.#problemTemplate;
    }
}
module.exports = {
    LanguageEntity: LanguageEntity
}