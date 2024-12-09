import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCJbWABChxmW8i_Ufhj-7KYJ9vrnEDXGpM",
  authDomain: "skiddy-c32ea.firebaseapp.com",
  projectId: "skiddy-c32ea",
  storageBucket: "skiddy-c32ea.firebasestorage.app",
  messagingSenderId: "634302486948",
  appId: "1:634302486948:web:5328f81a0d06095ca94931",
  measurementId: "G-5210T14G4K"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);

// Function to request notification permission and get FCM token
export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: 'BE-QJKB-_YlsNXgZTlj78obBas84XmTvkiBqo3Qs6jSjoMY39OqiPJJz5_CSMKpANRWGx2Y6AoiEIeA5lHoEB30' // Replace with your VAPID key from Firebase Console
      });
      console.log('FCM Token:', token);
      return token;
    }
    throw new Error('Notification permission denied');
  } catch (error) {
    console.error('Error getting notification permission:', error);
    throw error;
  }
}

// Function to handle foreground messages
export function onMessageListener() {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
}
