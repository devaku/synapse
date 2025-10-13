import { z } from 'zod';

export const TaskTools = {
  // CREATE TASK
  create_task: {
    name: 'create_task',
    description: 'Create a new task in the task management system. Automatically subscribes the creator.',
    inputSchema: z.object({
      name: z.string().describe('Task name/title'),
      description: z.string().describe('Detailed task description'),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
      taskVisibleToUsers: z.array(z.number()).optional().describe('Array of user IDs who can see this task'),
      taskVisibleToTeams: z.array(z.number()).optional().describe('Array of team IDs who can see this task'),
      taskHiddenFromUsers: z.array(z.number()).optional().describe('Array of user IDs who cannot see this task'),
      startDate: z.string().optional().describe('Task start date (ISO 8601 format)'),
    }),
  },

  // READ TASKS
  read_tasks: {
    name: 'read_tasks',
    description: 'Retrieve tasks. Can filter by ID, user visibility, or subscriptions.',
    inputSchema: z.object({
      taskId: z.number().optional().describe('Specific task ID to retrieve'),
      userOnly: z.boolean().optional().describe('Only return tasks visible to current user'),
      subscribedOnly: z.boolean().optional().describe('Only return tasks user is subscribed to'),
    }),
  },

  // UPDATE TASK
  update_task: {
    name: 'update_task',
    description: 'Update an existing task. Can modify task details and visibility rules.',
    inputSchema: z.object({
      taskId: z.number().describe('ID of task to update'),
      name: z.string().optional(),
      description: z.string().optional(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
      taskVisibleToUsers: z.array(z.number()).optional(),
      taskVisibleToTeams: z.array(z.number()).optional(),
      taskHiddenFromUsers: z.array(z.number()).optional(),
      startDate: z.string().optional(),
    }),
  },

  // SUBSCRIBE TO TASK
  subscribe_task: {
    name: 'subscribe_task',
    description: 'Subscribe the current user to a task to receive updates.',
    inputSchema: z.object({
      taskId: z.number().describe('ID of task to subscribe to'),
    }),
  },

  // UNSUBSCRIBE FROM TASK
  unsubscribe_task: {
    name: 'unsubscribe_task',
    description: 'Unsubscribe the current user from a task.',
    inputSchema: z.object({
      taskId: z.number().describe('ID of task to unsubscribe from'),
    }),
  },
};