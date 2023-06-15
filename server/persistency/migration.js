const { mysqlPool } = require("./db");
const { PoolConnection } = require("mysql2");
const {Logger} = require("../lib/logger/Logger");
const logger = new Logger("API-SERVER", "migration.js");
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
				logger.error(err);
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
				logger.error(err);
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
					logger.error(err);
					reject(err);
					return;
				}
				try {
					for (let schemaName of schemaNames) {
						await dropTableIfExists(schemaName, connection);
					}
				} catch (error) {
					logger.error(error);
					connection.release();
					reject(err);
					return;
				}
				try {
					for (let schema of schemas) {
						await createTable(schema, connection);
					}
				} catch(error) {
					logger.info(error);
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
					logger.error(err);
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
