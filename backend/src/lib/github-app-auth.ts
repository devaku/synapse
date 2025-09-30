// utils/githubAuth.ts
import fs from "fs";
import jwt from "jsonwebtoken";


/*
*
*
* 
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
