importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCJbWABChxmW8i_Ufhj-7KYJ9vrnEDXGpM",
  authDomain: "skiddy-c32ea.firebaseapp.com",
  projectId: "skiddy-c32ea",
  storageBucket: "skiddy-c32ea.firebasestorage.app",
  messagingSenderId: "634302486948",
  appId: "1:634302486948:web:5328f81a0d06095ca94931",
  measurementId: "G-5210T14G4K"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    data: payload.data
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
