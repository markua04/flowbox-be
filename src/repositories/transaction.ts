import { db } from "./db"

const runInTransaction = async <T>(fn: () => Promise<T>): Promise<T> => {
	await new Promise<void>((resolve, reject) => {
		db.run("BEGIN", err => {
			if (err) {
				return reject(err)
			}
			resolve()
		})
	})

	try {
		const result = await fn()
		await new Promise<void>((resolve, reject) => {
			db.run("COMMIT", err => {
				if (err) {
					return reject(err)
				}
				resolve()
			})
		})
		return result
	} catch (error) {
		await new Promise<void>((resolve, reject) => {
			db.run("ROLLBACK", err => {
				if (err) {
					return reject(err)
				}
				resolve()
			})
		})
		throw error
	}
}

export { runInTransaction }
