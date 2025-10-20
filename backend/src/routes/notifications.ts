import express from 'express';
import { readAllNotifications } from '../controllers/notification-controller';

const notificationRouter = express.Router();

// endpoint to read all notification
notificationRouter.get('/notifications', readAllNotifications);

export default notificationRouter;
