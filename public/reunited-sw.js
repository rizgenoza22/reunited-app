// REunited web-push service worker.
// Critical #2C: receives push payloads and displays browser notifications.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = {};

  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = {
      title: "REunited",
      message: event.data
        ? event.data.text()
        : "You have a new REunited alert.",
    };
  }

  const title = payload.title || "REunited";

  const options = {
    body:
      payload.message ||
      "You have a new REunited alert.",

    icon: "/favicon.ico",

    badge: "/favicon.ico",

    tag:
      payload.reportId || payload.sightingId
        ? `reunited-${payload.reportId || "x"}-${payload.sightingId || "x"}`
        : "reunited-alert",

    data: {
      url: payload.url || "/",
      reportId: payload.reportId ?? null,
      sightingId: payload.sightingId ?? null,
    },
  };

  event.waitUntil(
    self.registration.showNotification(
      title,
      options,
    ),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl =
    event.notification?.data?.url || "/";

  event.waitUntil(
    self.clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clients) => {
        for (const client of clients) {
          if ("focus" in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }

        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }

        return undefined;
      }),
  );
});