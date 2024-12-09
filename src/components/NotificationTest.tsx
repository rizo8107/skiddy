import React, { useState } from 'react';
import { Button } from './ui/button';
import { notificationService } from '../services/notificationService';
import { pushNotificationService } from '../services/pushNotificationService';
import { pb } from '../lib/pocketbase';
import { toast } from './ui/use-toast';

export function NotificationTest() {
  const [isSending, setIsSending] = useState(false);

  const handleTestNotification = async () => {
    try {
      setIsSending(true);

      // Initialize notification service and request permissions
      await notificationService.initialize();
      
      // Get current user
      const user = pb.authStore.model;
      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to test notifications',
          variant: 'destructive',
        });
        return;
      }

      // Send both a local notification and a push notification
      await Promise.all([
        notificationService.sendTestNotification(),
        pushNotificationService.sendTestNotification(user.id),
      ]);

      toast({
        title: 'Success',
        description: 'Test notifications sent successfully!',
      });
    } catch (error) {
      console.error('Error testing notifications:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send test notifications',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Test Notifications</h3>
      <p className="text-sm text-muted-foreground">
        Click the button below to test push notifications. Make sure you have granted notification permissions.
      </p>
      <Button 
        onClick={handleTestNotification}
        disabled={isSending}
      >
        {isSending ? 'Sending...' : 'Send Test Notification'}
      </Button>
    </div>
  );
}
