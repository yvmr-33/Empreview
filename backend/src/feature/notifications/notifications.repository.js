import mongoose from 'mongoose';
import { notificationSchema } from './notifications.schema.js';
import { customError } from '../../middlewares/error.middleware.js';
import { userRepository } from '../users/user.repository.js';

const notificationModel = mongoose.model('notifications', notificationSchema);
const userRepo = new userRepository();

export class notificationRepository {
    add = async (userId, msg, companyName) => {
        try {
            let newNotification;
            if(companyName){
                newNotification = new notificationModel({
                    userId,
                    msg,
                    companyName
                });
            }
            else{
                newNotification = new notificationModel({
                    userId,
                    msg
                });
            }
            await newNotification.save();
            await userRepo.updateTheNotificationCount(userId,1);
            return newNotification;
        } catch (err) {
            throw new customError(400, 'something went wrong while adding the notification');
        }
    }
    get = async (userId) => {
        try {
            const notifications = await notificationModel.find({ userId }).sort({ time: -1 });
            await notificationModel.updateMany({ userId }, { read: true });
            await userRepo.updateTheNotificationCount(userId,0);
            return notifications;
        } catch (err) {
            throw new customError(400, 'something went wrong while getting the notifications');
        }
    }
    delete = async (userId, notificationId) => {
        try {
            const notification = await notificationModel.findOne({ _id: notificationId });
            if (!notification) {
                throw new customError(404, 'notification not found');
            }
            if (notification.userId != userId) {
                throw new customError(403, 'you are not allowed to delete this notification');
            }
            await notificationModel.deleteOne({ _id: notificationId });
        } catch (err) {
            throw new customError(400, 'something went wrong while deleting the notification');
        }
    }
}
