import axios from "axios";
import { getInstallationAccessToken } from "../lib/github-app-auth";
import { prisma } from '../lib/database';
import { repoCollaboratorRequestType } from '../types';

/**
 * CREATE - Create a new repository collaborator request
 */
export async function createRepoCollaboratorRequest(
  userId: number,
  repoId: number,
  permission: string,
  githubUsername: string
) {
  try {
    const requestRow = await prisma.repoColaboratorRequest.create({
      data: {
        userId,
        repoId,
        permission,
        githubUsername,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return requestRow;
  } catch (error: any) {
    console.error('CREATE REPO COLLABORATOR REQUEST SERVICE ERROR:', error);
    
    // Handle Prisma errors
    if (error.code === 'P2002') {
      throw new Error('A repository collaborator request with these details already exists');
    } else if (error.code === 'P2003') {
      throw new Error(`Foreign key constraint failed. User with ID ${userId} does not exist`);
    } else if (error.code === 'P2025') {
      throw new Error('Related record not found');
    } else {
      throw new Error(`Database error: ${error.message || 'Unknown database error'}`);
    }
  }
}

/**
 * READ ALL - Get all repository collaborator requests
 */
export async function readAllRepoCollaboratorRequests() {
  return await prisma.repoColaboratorRequest.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

/**
 * READ BY ID - Get repository collaborator request by ID
 */
export async function readRepoCollaboratorRequestById(id: number) {
  return await prisma.repoColaboratorRequest.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

/**
 * READ BY USER ID - Get repository collaborator requests by user ID
 */
export async function readRepoCollaboratorRequestsByUserId(userId: number) {
  return await prisma.repoColaboratorRequest.findMany({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

/**
 * READ BY REPO ID - Get repository collaborator requests by repo ID
 */
export async function readRepoCollaboratorRequestsByRepoId(repoId: number) {
  return await prisma.repoColaboratorRequest.findMany({
    where: { repoId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

/**
 * UPDATE - Update repository collaborator request
 */
export async function updateRepoCollaboratorRequest(
  id: number,
  data: {
    repoId?: number;
    permission?: string;
    githubUsername?: string;
  }
) {
  return await prisma.repoColaboratorRequest.update({
    where: { id },
    data,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

/**
 * DELETE - Delete repository collaborator request
 */
export async function deleteRepoCollaboratorRequest(id: number) {
  return await prisma.repoColaboratorRequest.delete({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

/**
 * DELETE BY USER ID - Delete all repository collaborator requests for a user
 */
export async function deleteRepoCollaboratorRequestsByUserId(userId: number) {
  return await prisma.repoColaboratorRequest.deleteMany({
    where: { userId },
  });
}

/**
 * DELETE BY REPO ID - Delete all repository collaborator requests for a repo
 */
export async function deleteRepoCollaboratorRequestsByRepoId(repoId: number) {
  return await prisma.repoColaboratorRequest.deleteMany({
    where: { repoId },
  });
}

export async function addUserToRepo(
  repoId: number,
  username: string,
  permission: "pull" | "triage" | "push" | "maintain" | "admin"
) {
  const token = await getInstallationAccessToken();

  // Get repo owner/name from repoId
  const repoInfo = await axios.get(`https://api.github.com/repositories/${repoId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });

  const { full_name } = repoInfo.data; // "owner/repo"
  const [owner, repo] = full_name.split("/");

  // Invite the collaborator
  const res = await axios.put(
    `https://api.github.com/repos/${owner}/${repo}/collaborators/${username}`,
    { permission },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  return res.data;
}

