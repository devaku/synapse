import express from "express";
import { Request, Response } from 'express';
import { createGithubAppJwt, getInstallationAccessToken } from "../lib/github-app-auth";
import axios from "axios";

const app = express();

export async function getGithubRepos(req: Request, res: Response) {
    try {
        const token = await getInstallationAccessToken();
        
        const response = await axios.get("https://api.github.com/installation/repositories", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github+json",
            },
        });

        res.json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to fetch GitHub repositories");
    }
}

