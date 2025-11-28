self.addEventListener('push', (event) => {
  console.log('Push event received:', event);

  let data = {};

  try {
    data = event.data.json();
  } catch (err) {
    console.log('Error reading JSON:', err);
    data = { title: 'No title', body: event.data };
  }

  const title = data.title || 'Default title';
  const options = {
    body: data.body,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  handleNotificationClick(event);
});

const handleNotificationClick = async () => {
  //to be continued.
};
