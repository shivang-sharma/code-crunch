const {QueryData} = require("../QueryData");
class WhereQuery {
    #table
    #whereQuery
    #selectedColumn
    #whereSequence
    
    constructor() {
        this.#whereSequence = ['WHERE '];
        this.#selectedColumn = [];
    }
    /**
     * 
     * @param {String} tableName 
     * @returns 
     */
    from(tableName) {
        this.#table=tableName;
        return this;
    }
    select(columnName) {
        this.#selectedColumn.push(columnName);
        return this;
    }
    where(columnName) {
        this.#whereSequence.push(columnName);
        return this;
    }
    /**
     * 
     * @param {QueryData} queryData 
     */
    equals(queryData) {
        if (!(queryData instanceof QueryData)) {
            throw Error(`QueryData instance expected instead got ${queryData.constructor.name}`);
        }
        if (queryData.type === Number) {
            this.#whereSequence.push(`=${queryData.value} `);
        } else if (queryData.type === String) {
            this.#whereSequence.push(`=\'${queryData.value}\' `);
        }
        return this;
    }
    or() {
        this.#whereSequence.push('OR ');
        return this;
    }
    and() {
        this.#whereSequence.push('AND ');
        return this;
    }
    greaterThan(value) {
        this.#whereSequence.push(`>${value} `);
        return this;
    }
    greaterThanOrEquals(value) {
        this.#whereSequence.push(`>=${value} `);
        return this;
    }
    lessThan(value) {
        this.#whereSequence.push(`<${value} `);
        return this;
    }
    lessThanOrEquals(value) {
        this.#whereSequence.push(`<=${value} `);
        return this;
    }
    notEqual(value) {
        this.#whereSequence.push(`<>${value}`);
        return this;
    }
    between(lowerLimit, upperLimit) {
        this.#whereSequence.push(`BETWEEN ${lowerLimit} AND ${upperLimit} `);
        return this;
    }
    like(pattern) {
        this.#whereSequence.push(`LIKE \'${pattern}\' `);
        return this;
    }
    /**
     * 
     * @param {Array} array 
     */
    in(array) {
        const reducedStringArray = array.reduce(
            /**
             * 
             * @param {Array} reducedString 
             * @param {any} currentString 
             */
            (reducedString, currentString) => {
                if (currentString.type ===  Number) {
                    reducedString.push(`${currentString}`);
                } else {
                    reducedString.push(`\'${currentString}\'`);
                }
        }, []);
        const reducedString = `(${reducedStringArray.join(', ')})`;
        this.#whereSequence.push(`IN ${reducedString} `);
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
        if (this.#selectedColumn.length === 0) {
            throw Error(`Expected columns to be fetched but instead got none`);
        }
        if (this.#whereSequence.length == 0) {
            throw Error('Expected where conditions but got none');
        }
        let selectedColumnString = `SELECT ${this.#selectedColumn.join(", ")}`;
        let whereSequenceString = this.#whereSequence.join(" ");
        this.#whereQuery = `${selectedColumnString} FROM ${this.#table} ${whereSequenceString}`
        this.#whereQuery = `${this.#whereQuery.trim()};`;
        return this.#whereQuery;
    }
}
module.exports = {
    WhereQuery: WhereQuery
}