import { prismaDb } from '../../lib/database';
import { createUserService } from '../../services/user-service';

const userService = createUserService(prismaDb);

export class UserHandlers {
	/**
	 * List all users with optional search
	 */
	static async listUsers(params: any, userId: number) {
		try {
			const allUsers = await userService.readAllUsers();

			// Apply search filter if provided
			let filteredUsers = allUsers;
			if (params.search) {
				const searchLower = params.search.toLowerCase();
				filteredUsers = allUsers.filter((user: any) => {
					return (
						user.username?.toLowerCase().includes(searchLower) ||
						user.firstName?.toLowerCase().includes(searchLower) ||
						user.lastName?.toLowerCase().includes(searchLower) ||
						user.email?.toLowerCase().includes(searchLower)
					);
				});
			}

			// Return only necessary fields
			const simplifiedUsers = filteredUsers.map((user: any) => ({
				id: user.id,
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
			}));

			return {
				success: true,
				data: simplifiedUsers,
				message: `Found ${simplifiedUsers.length} users`,
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.message,
				message: 'Failed to list users',
			};
		}
	}

	/**
	 * Find a specific user by username, email, or ID
	 */
	static async findUser(params: any, userId: number) {
		try {
			let user: any = null;

			if (params.id) {
				// Find by ID
				user = await userService.readUser(params.id);
			} else if (params.username || params.email) {
				// Find by username or email
				const allUsers = await userService.readAllUsers();
				user = allUsers.find((u: any) => {
					if (params.username && u.username === params.username) {
						return true;
					}
					if (params.email && u.email === params.email) {
						return true;
					}
					return false;
				});
			} else {
				return {
					success: false,
					message: 'Please provide username, email, or id to search',
				};
			}

			if (!user) {
				return {
					success: false,
					message: 'User not found',
				};
			}

			// Return only necessary fields
			const simplifiedUser = {
				id: user.id,
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
			};

			return {
				success: true,
				data: simplifiedUser,
				message: 'User found',
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.message,
				message: 'Failed to find user',
			};
		}
	}
}
