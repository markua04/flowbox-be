import sqlite3 from "sqlite3"
import HttpError from "../utils/httpError"

const db = new sqlite3.Database("./database/main.db")

type SqlParams = readonly unknown[]

const query = <T>(sql: string, params: SqlParams = []): Promise<T[]> => new Promise((resolve, reject) => {
	db.prepare(sql).all(params, (err, rows) => {
		if (err) {
			return reject(new HttpError(500, "Database query failed", "DB_QUERY_ERROR", {
				sql
			}))
		}
		resolve(rows as T[])
	})
})

const execute = (sql: string, params: SqlParams = []): Promise<void> => new Promise((resolve, reject) => {
	db.run(sql, params, err => {
		if (err) {
			return reject(new HttpError(500, "Database execution failed", "DB_EXECUTE_ERROR", {
				sql
			}))
		}
		resolve()
	})
})

const insert = (sql: string, params: SqlParams = []): Promise<number> => new Promise((resolve, reject) => {
	db.run(sql, params, function(err) {
		if (err) {
			return reject(new HttpError(500, "Database insert failed", "DB_INSERT_ERROR", {
				sql
			}))
		}
		resolve(this.lastID ?? 0)
	})
})

export { db, execute, insert, query }
