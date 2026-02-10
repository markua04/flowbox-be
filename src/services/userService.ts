import HttpError from "../utils/httpError"
import { getCompanyById, getInfluencerById } from "../repositories/userRepository"
import { UserType } from "../types/user"

const getUserProfile = async (id: number, type: UserType) => {
	const user = type === "company" ? await getCompanyById(id) : await getInfluencerById(id)
	if (!user) {
		throw new HttpError(404, "User not found")
	}
	return user
}

export { getUserProfile }
