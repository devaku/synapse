import express from "express";
import { createGithubAppJwt } from "../lib/github-app-auth";

const app = express();

export function getGithubJwt(req: express.Request, res: express.Response) {

    try {
        const jwt = createGithubAppJwt();
        res.json({ token: jwt });
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to generate JWT");
    }
}



