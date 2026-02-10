import { createSchema } from "../migrations/schema"
import { seedData } from "../seeds/seedRepository"

const initializeDatabase = async (): Promise<void> => {
	await createSchema()
	await seedData()
}

export { initializeDatabase }
