import { pb } from '../lib/pocketbase';

interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

interface FCMResponse {
  multicast_id: number;
  success: number;
  failure: number;
  results: Array<{ message_id?: string; error?: string }>;
}

class PushNotificationService {
  private static instance: PushNotificationService;
  private serverKey: string;

  private constructor() {
    // Replace with your Firebase Server Key from Project Settings > Cloud Messaging
    this.serverKey = 'AAAA5ixvlBg:APA91bGPwxrJKEYXWbvvnFCzRnXSBmZBtZDVABHKxFgOtKhNnYkJDjJSJVhKKDvDtWxVMFjnRbDWBVYlvFBtAcQrAHRsKzLGWGgXxlSNXMhWdGdB4Iy0_KxTWHnWDrPXVGZzDGFtTvEp';
  }

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  async sendToUsers(userIds: string[], notification: NotificationPayload): Promise<FCMResponse> {
    try {
      // Get user tokens
      const users = await pb.collection('users').getList(1, 50, {
        filter: userIds.map(id => `id="${id}"`).join('||'),
      });

      const tokens = users.items
        .map((user: any) => user.pushToken)
        .filter((token): token is string => !!token);

      if (tokens.length === 0) {
        console.log('No valid tokens found for the specified users');
        return {
          multicast_id: 0,
          success: 0,
          failure: 0,
          results: []
        };
      }

      // Prepare the message
      const message = {
        registration_ids: tokens,
        notification: {
          title: notification.title,
          body: notification.body,
          icon: '/icon-192x192.png',
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
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

  // Helper methods for different notification types
  async notifyCourseUpdate(courseId: string, title: string, description: string) {
    try {
      // Get all enrolled users
      const enrollments = await pb.collection('enrollments').getList(1, 50, {
        filter: `course="${courseId}"`,
      });

      const userIds = enrollments.items.map(enrollment => enrollment.user);

      if (userIds.length === 0) {
        console.log('No users enrolled in this course');
        return;
      }

      return this.sendToUsers(userIds, {
        title: `Course Update: ${title}`,
        body: description,
        data: {
          type: 'course_update',
          courseId,
        },
      });
    } catch (error) {
      console.error('Error sending course update notification:', error);
      throw error;
    }
  }

  async notifyNewLesson(courseId: string, lessonTitle: string) {
    try {
      // Get all enrolled users
      const enrollments = await pb.collection('enrollments').getList(1, 50, {
        filter: `course="${courseId}"`,
      });

      const userIds = enrollments.items.map(enrollment => enrollment.user);

      if (userIds.length === 0) {
        console.log('No users enrolled in this course');
        return;
      }

      return this.sendToUsers(userIds, {
        title: 'New Lesson Available',
        body: `A new lesson "${lessonTitle}" has been added to your course`,
        data: {
          type: 'new_lesson',
          courseId,
        },
      });
    } catch (error) {
      console.error('Error sending new lesson notification:', error);
      throw error;
    }
  }

  async notifyAssignmentDue(courseId: string, assignmentTitle: string, dueDate: Date) {
    try {
      // Get all enrolled users
      const enrollments = await pb.collection('enrollments').getList(1, 50, {
        filter: `course="${courseId}"`,
      });

      const userIds = enrollments.items.map(enrollment => enrollment.user);

      if (userIds.length === 0) {
        console.log('No users enrolled in this course');
        return;
      }

      const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }).format(dueDate);

      return this.sendToUsers(userIds, {
        title: 'Assignment Due Soon',
        body: `"${assignmentTitle}" is due on ${formattedDate}`,
        data: {
          type: 'assignment_due',
          courseId,
        },
      });
    } catch (error) {
      console.error('Error sending assignment due notification:', error);
      throw error;
    }
  }

  // Test notification
  async sendTestNotification(userId: string) {
    return this.sendToUsers([userId], {
      title: 'Test Notification',
      body: 'This is a test notification from Skiddy Learning Platform',
      data: {
        type: 'test',
      },
    });
  }
}

export const pushNotificationService = PushNotificationService.getInstance();
