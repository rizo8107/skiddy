import { 
  PushNotifications,
  PushNotificationSchema,
  ActionPerformed,
  Token,
} from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { pb } from '../lib/pocketbase';
import { requestNotificationPermission, onMessageListener } from '../lib/firebase';

class NotificationService {
  private static instance: NotificationService;
  private initialized = false;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize() {
    if (this.initialized) return;

    // Check if we're on a supported platform
    const platform = Capacitor.getPlatform();
    if (platform !== 'android' && platform !== 'web') {
      console.log('Push notifications are not supported on this platform');
      return;
    }

    // Request permission and initialize based on platform
    if (platform === 'web') {
      await this.initializeWebNotifications();
    } else if (platform === 'android') {
      await this.initializeAndroidNotifications();
    }

    this.initialized = true;
  }

  private async initializeWebNotifications() {
    try {
      const token = await requestNotificationPermission();
      if (token) {
        await this.saveFCMToken(token);
        this.setupWebNotificationListeners();
      }
    } catch (error) {
      console.error('Failed to initialize web notifications:', error);
      throw error;
    }
  }

  private async initializeAndroidNotifications() {
    try {
      const { receive } = await PushNotifications.checkPermissions();
      if (receive === 'prompt') {
        const { receive } = await PushNotifications.requestPermissions();
        if (receive !== 'granted') {
          throw new Error('Push notification permission denied');
        }
      }

      await PushNotifications.register();
      this.setupAndroidNotificationListeners();
    } catch (error) {
      console.error('Failed to initialize Android notifications:', error);
      throw error;
    }
  }

  private setupWebNotificationListeners() {
    onMessageListener()
      .then((payload: any) => {
        console.log('Received foreground message:', payload);
        this.showLocalNotification({
          title: payload.notification.title,
          body: payload.notification.body,
          id: Math.floor(Math.random() * 10000).toString(),
          data: payload.data
        });
      })
      .catch(err => console.error('Failed to setup web notification listener:', err));
  }

  private setupAndroidNotificationListeners() {
    // On registration success
    PushNotifications.addListener('registration', async (token: Token) => {
      console.log('Push registration success, token:', token.value);
      await this.saveFCMToken(token.value);
    });

    // On registration error
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error on registration:', error);
    });

    // On push notification received
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push notification received:', notification);
      this.showLocalNotification({
        title: notification.title || '',
        body: notification.body || '',
        id: parseInt(notification.id) || Math.floor(Math.random() * 10000),
        data: notification.data
      });
    });

    // On push notification action performed
    PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
      console.log('Push notification action performed:', action);
    });
  }

  private async saveFCMToken(token: string) {
    try {
      const user = pb.authStore.model;
      if (!user) {
        console.error('No user logged in, cannot save FCM token');
        return;
      }

      // Update the user's FCM token
      await pb.collection('users').update(user.id, {
        fcm_token: token,
        updated: new Date().toISOString()
      });
      console.log('FCM token saved successfully');
    } catch (error) {
      console.error('Error saving FCM token:', error);
      throw error;
    }
  }

  async showLocalNotification(notification: PushNotificationSchema) {
    try {
      const notificationId = Math.floor(Math.random() * 10000);
      await LocalNotifications.schedule({
        notifications: [
          {
            id: notificationId,
            title: notification.title || 'Notification',
            body: notification.body || '',
            schedule: { at: new Date(Date.now()) },
            sound: 'default',
            attachments: notification.attachments,
            actionTypeId: notification.id,
            extra: notification.data
          }
        ]
      });
      console.log('Local notification scheduled:', notificationId);
    } catch (error) {
      console.error('Error showing local notification:', error);
      throw error;
    }
  }

  private async handleNotificationAction(action: ActionPerformed) {
    try {
      const notification = action.notification;
      const data = notification.data;

      console.log('Handling notification action:', { notification, data });

      // Handle different notification types
      switch (data?.type) {
        case 'course_update':
          window.location.href = `/course/${data.courseId}`;
          break;
        case 'new_message':
          window.location.href = '/messages';
          break;
        case 'assignment':
          window.location.href = `/course/${data.courseId}/assignment/${data.assignmentId}`;
          break;
        case 'test':
          console.log('Test notification clicked');
          break;
        default:
          console.log('Unknown notification type:', data?.type);
          break;
      }
    } catch (error) {
      console.error('Error handling notification action:', error);
    }
  }

  // Method to send a test notification (for development)
  async sendTestNotification() {
    try {
      const platform = Capacitor.getPlatform();
      console.log('Sending test notification on platform:', platform);
      
      await this.showLocalNotification({
        title: 'Test Notification',
        body: 'This is a test notification from Skiddy Learning Platform',
        id: Date.now().toString(),
        data: {
          type: 'test'
        }
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
      throw error;
    }
  }
}

export const notificationService = NotificationService.getInstance();
