const { QueryData } = require("../QueryData");
class InsertQuery {
    #table
    #insertQuery
    #columnValue

    constructor() {
        this.#columnValue = [];
    }
    /**
     * 
     * @param {String} tableName 
     * @returns 
     */
    into(tableName) {
        this.#table = tableName;
        return this;
    }
    /**
     * 
     * @param {QueryData} queryData 
     * @returns 
     */
    insert(queryData) {
        this.#columnValue.push(queryData);
        return this;
    }
    /**
     * 
     * @returns {String}
     */
    build() {
        if (this.#table === undefined) {
            throw Error(`Table name expected but instead got '${this.#table}'`);
        }
        if (this.#columnValue.length === 0) {
            throw Error(`Expected data to be inserted`);
        }
        let columns = [];
        let values = [];
        for (let queryData of this.#columnValue) {
            if (!(queryData instanceof QueryData)) {
                throw Error(`QueryData instance expected instead got ${queryData.constructor.name}`);
            }
            columns.push(queryData.column);
            if (queryData.type === Number) {
                values.push(queryData.value);
            }
            if (queryData.type === String) {
                values.push(`\'${queryData.value}\'`);
            }
        }
        this.#insertQuery = "INSERT INTO " + this.#table;
        this.#insertQuery = this.#insertQuery + ` (${columns.join(', ')}) VALUES (${values.join(', ')})`;
        return this.#insertQuery;
    }
}
module.exports = {
    InsertQuery: InsertQuery
}