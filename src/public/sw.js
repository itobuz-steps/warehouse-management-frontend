self.addEventListener('push', (event) => {

  let data = {};

  try {
    data = event.data.json();
  } catch {
    data = { title: 'No title', body: event.data };
  }

  const title = data.title || 'Default title';
  const options = {
    body: data.body
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// self.addEventListener('notificationclick', (event) => {
//   handleNotificationClick(event);
// });


