import { pb } from '../lib/pocketbase';

interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, string>;
}

class FirebaseService {
  private static instance: FirebaseService;
  private serverKey: string;

  private constructor() {
    // Replace with your Firebase Server Key
    this.serverKey = 'YOUR_FIREBASE_SERVER_KEY';
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  async sendNotification(userIds: string[], notification: NotificationData) {
    try {
      // Get user tokens
      const users = await pb.collection('users').getList(1, 50, {
        filter: `id?~ "${userIds.join('","')}"`,
      });

      const tokens = users.items
        .map((user) => user.pushToken)
        .filter((token): token is string => !!token);

      if (tokens.length === 0) {
        console.log('No valid tokens found for the specified users');
        return;
      }

      // Prepare the message
      const message = {
        registration_ids: tokens,
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data || {},
        priority: 'high',
      };

      // Send to Firebase
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=${this.serverKey}`,
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      const result = await response.json();
      console.log('Notification sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  // Example methods for different notification types
  async notifyCourseUpdate(courseId: string, courseTitle: string) {
    const users = await pb.collection('enrollments').getList(1, 50, {
      filter: `course="${courseId}"`,
      expand: 'user',
    });

    const userIds = users.items.map((enrollment) => enrollment.user);

    return this.sendNotification(userIds, {
      title: 'Course Update',
      body: `New content available in ${courseTitle}`,
      data: {
        type: 'course_update',
        courseId,
      },
    });
  }

  async notifyNewMessage(userId: string, senderName: string) {
    return this.sendNotification([userId], {
      title: 'New Message',
      body: `You have a new message from ${senderName}`,
      data: {
        type: 'new_message',
      },
    });
  }

  async notifyNewAssignment(courseId: string, assignmentTitle: string) {
    const users = await pb.collection('enrollments').getList(1, 50, {
      filter: `course="${courseId}"`,
      expand: 'user',
    });

    const userIds = users.items.map((enrollment) => enrollment.user);

    return this.sendNotification(userIds, {
      title: 'New Assignment',
      body: `New assignment available: ${assignmentTitle}`,
      data: {
        type: 'assignment',
        courseId,
      },
    });
  }
}

export const firebaseService = FirebaseService.getInstance();
