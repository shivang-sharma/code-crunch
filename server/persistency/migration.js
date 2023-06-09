const { mysqlPool } = require("./db");
const { PoolConnection } = require("mysql2");

const {
	schemas,
	schemaNames,
} = require("./migrations/schema");
const { userData, languageData, problemData } = require("./migrations/data");

/**
 *
 * @param {String} tableName
 * @param {PoolConnection} connection
 */
function dropTableIfExists(tableName, connection) {
	return new Promise((resolve, reject) => {
		connection.execute(`DROP TABLE IF EXISTS ${tableName}`, (err, result) => {
			if (err) {
				console.log(err);
				reject(err);
				return;
			}
			resolve();
		});
	});
}
/**
 * 
 * @param {String} tableName 
 * @param {PoolConnection} connection 
 * @returns 
 */
function createTable(tableSchema, connection) {
	return new Promise((resolve, reject) => {
		connection.query(tableSchema, (err, rows, fields) => {
			if (err) {
				console.error(err);
				reject(err);
				return;
			}
			resolve();
		});
	});
}
module.exports = {
	migrateSchema: function () {
		return new Promise((resolve, reject) => {
			mysqlPool.getConnection(async (err, connection) => {
				if (err) {
					console.error(err);
					reject(err);
					return;
				}
				try {
					for (let schemaName of schemaNames) {
						await dropTableIfExists(schemaName, connection);
					}
				} catch (error) {
					console.log(error);
					connection.release();
					reject(err);
					return;
				}
				try {
					for (let schema of schemas) {
						await createTable(schema, connection);
					}
				} catch(error) {
					console.log(error);
					connection.release();
					reject(err);
					return;
				}
				resolve();
			});
		});
	},
	migrateData: function () {
		return new Promise((resolve, reject) => {
			mysqlPool.getConnection((err, connection) => {
				if (err) {
					console.error(err);
					connection.release();
					reject(err);
					return;
				}
				for (let query of userData) {
					connection.query(query);
				}
				for (let query of languageData) {
					connection.query(query);
				}
				for (let query of problemData) {
					connection.query(query);
				}
				connection.release();
				resolve();
			});
		});
	},
};
