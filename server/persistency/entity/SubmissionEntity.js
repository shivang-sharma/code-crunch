class SubmissionEntity {
    #submissionId;
    #submission;
    #submissionLanguageId;
    #submissionStatus; // IN ('ACCEPTED', 'REJECTED'),
    #submissionProblemId;
    #submissionResult;
    #submissionUserId;

    constructor(submissionId, submission, submissionLanguageId, submissionStatus, submissionProblemId, submissionResult, submissionUserId) {
        this.#submissionId = submissionId;
        this.#submission = submission;
        this.#submissionLanguageId = submissionLanguageId;
        this.#submissionStatus = submissionStatus;
        this.#submissionProblemId = submissionProblemId;
        this.#submissionResult = submissionResult;
        this.#submissionUserId = submissionUserId;

    }
    get submissionId() {
        return this.#submissionId;
    }
    get submission() {
        return this.#submission;
    }
    get submissionLanguageId() {
        return this.#submissionLanguageId;
    }
    get submissionStatus() {
        return this.#submissionStatus;
    }
    get submissionProblemId() {
        return this.#submissionProblemId;
    }
    get submissionResult() {
        return this.#submissionResult;
    }
    get submissionUserId() {
        return this.#submissionUserId;
    }
}