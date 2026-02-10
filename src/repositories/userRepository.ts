import { query } from "./db"

interface UserRow {
	id: number
	email: string
	name: string
}

const getCompanyById = async (id: number): Promise<UserRow | null> => {
	const [row] = await query<UserRow>("SELECT id, email, name FROM companies WHERE id = ?", [id])
	return row ?? null
}

const getInfluencerById = async (id: number): Promise<UserRow | null> => {
	const [row] = await query<UserRow>("SELECT id, email, name FROM influencers WHERE id = ?", [id])
	return row ?? null
}

export { getCompanyById, getInfluencerById }
export type { UserRow }
