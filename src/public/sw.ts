declare const self: ServiceWorkerGlobalScope;

self.addEventListener('push', (event: PushEvent) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json() || { title: 'No title', body: event.data };

  const title = data.title || 'Default title';
  const options = {
    body: data.body,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
