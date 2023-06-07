class QueryData {
    #column
    #value
    #type
    constructor(columnName, value, type) {
        this.#column = columnName;
        this.#value = value;
        this.#type = type;
    }
    get column() {
        return this.#column;
    }
    get value() {
        return this.#value;
    }
    get type() {
        return this.#type;
    }
}
module.exports = {
    QueryData: QueryData
}