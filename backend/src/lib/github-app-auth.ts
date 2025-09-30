// utils/githubAuth.ts
import fs from "fs";
import jwt from "jsonwebtoken";
import axios from "axios";


/* 
* @returns {string} The JWT token
*
* 
*/

/**
 * Gets the JWT for the gihub app
 * @returns {string} The JWT token
 */
export function createGithubAppJwt(): string {
  const appId = process.env.GITHUB_APP_ID!;
  const privateKey = fs.readFileSync(process.env.GITHUB_PRIVATE_KEY_PATH!, "utf8");

  const now = Math.floor(Date.now() / 1000); 

  const payload = {
    iat: now - 60,          // Issued at time: 1 minute back to account for clock drift (recomended by GitHub)
    exp: now + (10 * 60),   // Expiration time: 10 minutes (max allowed by GitHub)
    iss: appId              // Issuer: GitHub App ID
  };

  return jwt.sign(payload, privateKey, { algorithm: "RS256" }); // GitHub requires RS256 algorithm
}

export async function getInstallationAccessToken(): Promise<string> {
    const url = `https://api.github.com/app/installations/${process.env.GITHUB_INSTALLATION_ID}/access_tokens`;

    try {
        const response = await axios.post(url, {}, {
            headers: {
                Authorization: `Bearer ${createGithubAppJwt()}`,
                Accept: "application/vnd.github+json",
            },
        });

        return response.data.token;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data || error.message;
            throw new Error(`Failed to get installation token: ${error.response?.status} ${error.response?.statusText} - ${errorMessage}`);
        }
        throw error;
    }
}
