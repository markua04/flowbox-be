import sqlite3 from "sqlite3"
import HttpError from "../utils/httpError"

const dbPath = process.env.DB_PATH ?? "./database/main.db"
const db = new sqlite3.Database(dbPath)

db.run("PRAGMA foreign_keys = ON")

type SqlParams = readonly unknown[]

const query = <T>(sql: string, params: SqlParams = []): Promise<T[]> => new Promise((resolve, reject) => {
	db.all(sql, params, (err, rows) => {
		if (err) {
			return reject(new HttpError(500, "Database query failed", "DB_QUERY_ERROR"))
		}
		resolve(rows as T[])
	})
})

const execute = (sql: string, params: SqlParams = []): Promise<void> => new Promise((resolve, reject) => {
	db.run(sql, params, err => {
		if (err) {
			return reject(new HttpError(500, "Database execution failed", "DB_EXECUTE_ERROR"))
		}
		resolve()
	})
})

const insert = (sql: string, params: SqlParams = []): Promise<number> => new Promise((resolve, reject) => {
	db.run(sql, params, function(err) {
		if (err) {
			return reject(new HttpError(500, "Database insert failed", "DB_INSERT_ERROR"))
		}
		resolve(this.lastID ?? 0)
	})
})

export { db, execute, insert, query }
