import { createSchema } from "../repositories/schemaRepository"
import { seedData } from "../seeds/seedRepository"

const initializeDatabase = async (): Promise<void> => {
	await createSchema()
	await seedData()
}

export { initializeDatabase }
