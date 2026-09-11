const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000";

function getToken() {
  return localStorage.getItem("access_token");
}

async function handleResponse(response) {
  const text = await response.text();

  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;

    throw new Error(
      Array.isArray(message)
        ? message.join(", ")
        : message,
    );
  }

  return data;
}

function authHeaders() {
  const token = getToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

// ======================================================
// NEARBY REPORTS
// ======================================================

export async function getNearbyReports(
  latitude,
  longitude,
  radiusKm = 3,
) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    radiusKm: String(radiusKm),
  });

  const response = await fetch(
    `${API_BASE_URL}/reports/nearby?${params.toString()}`,
    {
      method: "GET",
      headers: {
        ...authHeaders(),
      },
    },
  );

  return handleResponse(response);
}

// ======================================================
// SIGHTINGS
// ======================================================

export async function createSighting(
  reportId,
  data,
) {
  const response = await fetch(
    `${API_BASE_URL}/reports/${reportId}/sightings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(data),
    },
  );

  return handleResponse(response);
}

export async function getSightings(reportId) {
  const response = await fetch(
    `${API_BASE_URL}/reports/${reportId}/sightings`,
    {
      method: "GET",
      headers: {
        ...authHeaders(),
      },
    },
  );

  return handleResponse(response);
}

// ======================================================
// SIGHTING PHOTOS
// ======================================================

export async function uploadSightingPhoto(
  reportId,
  sightingId,
  file,
) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/reports/${reportId}/sightings/${sightingId}/photos`,
    {
      method: "POST",
      headers: {
        ...authHeaders(),
      },
      body: formData,
    },
  );

  return handleResponse(response);
}

export async function getSightingPhotos(
  reportId,
  sightingId,
) {
  const response = await fetch(
    `${API_BASE_URL}/reports/${reportId}/sightings/${sightingId}/photos`,
    {
      method: "GET",
      headers: {
        ...authHeaders(),
      },
    },
  );

  return handleResponse(response);
}

// ======================================================
// NOTIFICATIONS
// ======================================================

export async function updateAlertLocation(
  latitude,
  longitude,
  nearbyAlertsEnabled = true,
) {
  const response = await fetch(
    `${API_BASE_URL}/notifications/alert-location`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        latitude: Number(latitude),
        longitude: Number(longitude),
        nearby_alerts_enabled: Boolean(nearbyAlertsEnabled),
      }),
    },
  );

  return handleResponse(response);
}

export async function setNearbyAlertsEnabled(enabled) {
  const response = await fetch(
    `${API_BASE_URL}/notifications/nearby-alerts`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        enabled: Boolean(enabled),
      }),
    },
  );

  return handleResponse(response);
}

export async function getNotifications() {
  const response = await fetch(
    `${API_BASE_URL}/notifications`,
    {
      method: "GET",
      headers: {
        ...authHeaders(),
      },
    },
  );

  return handleResponse(response);
}

export async function getNotificationUnreadCount() {
  const response = await fetch(
    `${API_BASE_URL}/notifications/unread-count`,
    {
      method: "GET",
      headers: {
        ...authHeaders(),
      },
    },
  );

  return handleResponse(response);
}

export async function markNotificationAsRead(
  notificationId,
) {
  const response = await fetch(
    `${API_BASE_URL}/notifications/${notificationId}/read`,
    {
      method: "PATCH",
      headers: {
        ...authHeaders(),
      },
    },
  );

  return handleResponse(response);
}

export async function markAllNotificationsAsRead() {
  const response = await fetch(
    `${API_BASE_URL}/notifications/read-all`,
    {
      method: "PATCH",
      headers: {
        ...authHeaders(),
      },
    },
  );

  return handleResponse(response);
}

// ======================================================
// PETS
// ======================================================

export async function getPets() {
  const response = await fetch(
    `${API_BASE_URL}/pets`,
    {
      method: "GET",
      headers: {
        ...authHeaders(),
      },
    },
  );

  return handleResponse(response);
}

export async function createPet(data) {
  const response = await fetch(
    `${API_BASE_URL}/pets`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(data),
    },
  );

  return handleResponse(response);
}

export async function reportPetMissing(
  petId,
  data,
) {
  const response = await fetch(
    `${API_BASE_URL}/pets/${petId}/missing`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(data),
    },
  );

  return handleResponse(response);
}

// ======================================================
// REPORT REVIEW / ADMIN
// ======================================================

export async function getReports() {
  const response = await fetch(
    `${API_BASE_URL}/reports`,
    {
      method: "GET",
      headers: {
        ...authHeaders(),
      },
    },
  );

  return handleResponse(response);
}

export async function getReport(reportId) {
  const response = await fetch(
    `${API_BASE_URL}/reports/${reportId}`,
    {
      method: "GET",
      headers: {
        ...authHeaders(),
      },
    },
  );

  return handleResponse(response);
}

export async function approveReport(reportId) {
  const response = await fetch(
    `${API_BASE_URL}/reports/${reportId}/approve`,
    {
      method: "PATCH",
      headers: {
        ...authHeaders(),
      },
    },
  );

  return handleResponse(response);
}

// ======================================================
// PET STATUS
// ======================================================

export async function updatePetStatus(
  petId,
  status,
) {
  const response = await fetch(
    `${API_BASE_URL}/pets/${petId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        status,
      }),
    },
  );

  return handleResponse(response);
}

// ======================================================
// PRIVATE MESSAGES
// ======================================================

export async function getMessageThread(
  reportId,
  otherUserId,
) {
  const response = await fetch(
    `${API_BASE_URL}/messages/thread/${reportId}/${otherUserId}`,
    {
      method: "GET",
      headers: {
        ...authHeaders(),
      },
    },
  );

  return handleResponse(response);
}

export async function sendPrivateMessage(
  reportId,
  recipientId,
  messageText,
) {
  const response = await fetch(
    `${API_BASE_URL}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        report_id: Number(reportId),
        recipient_id: Number(recipientId),
        message_text: messageText,
      }),
    },
  );

  return handleResponse(response);
}

export async function getMessageThreads() {
  const response = await fetch(
    `${API_BASE_URL}/messages/threads`,
    {
      method: "GET",
      headers: {
        ...authHeaders(),
      },
    },
  );

  return handleResponse(response);
}
// ======================================================
// REUNIONS / REUNION STORIES
// ======================================================

export async function createReunion(data) {
  const response = await fetch(
    `${API_BASE_URL}/reunions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(data),
    },
  );

  return handleResponse(response);
}

export async function getMyReunions() {
  const response = await fetch(`${API_BASE_URL}/reunions/mine`, {
    method: "GET",
    headers: { ...authHeaders() },
  });
  return handleResponse(response);
}

export async function getHeroRecognitions() {
  const response = await fetch(`${API_BASE_URL}/reunions/hero-recognitions`, {
    method: "GET",
    headers: { ...authHeaders() },
  });
  return handleResponse(response);
}

export async function getReunionStories() {
  const response = await fetch(`${API_BASE_URL}/reunions/stories`, {
    method: "GET",
  });
  return handleResponse(response);
}

// ======================================================
// PROFILE / SIGHTING ACTIVITY
// ======================================================

export async function getMySightingCount() {
  const response = await fetch(
    `${API_BASE_URL}/sightings/mine/count`,
    {
      method: "GET",
      headers: {
        ...authHeaders(),
      },
    },
  );

  return handleResponse(response);
}

// ======================================================
// PROFILE / REPORT ACTIVITY
// ======================================================

export async function getMyReportCount() {
  const response = await fetch(
    `${API_BASE_URL}/reports/mine/count`,
    {
      method: "GET",
      headers: {
        ...authHeaders(),
      },
    },
  );

  return handleResponse(response);
}

// ======================================================
// USER PROFILE
// ======================================================

export async function getMyProfile() {
  const response = await fetch(
    `${API_BASE_URL}/users/me`,
    {
      method: "GET",
      headers: {
        ...authHeaders(),
      },
    },
  );

  return handleResponse(response);
}

export async function updateMyProfile(data) {
  const response = await fetch(
    `${API_BASE_URL}/users/me`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(data),
    },
  );

  return handleResponse(response);
}

// ======================================================
// USER SAFETY / BLOCKING / REPORTING
// ======================================================

export async function blockUser(userId) {
  const response = await fetch(
    `${API_BASE_URL}/users/${Number(userId)}/block`,
    {
      method: "POST",
      headers: {
        ...authHeaders(),
      },
    },
  );

  return handleResponse(response);
}

export async function unblockUser(userId) {
  const response = await fetch(
    `${API_BASE_URL}/users/${Number(userId)}/block`,
    {
      method: "DELETE",
      headers: {
        ...authHeaders(),
      },
    },
  );

  return handleResponse(response);
}

export async function getBlockedUsers() {
  const response = await fetch(
    `${API_BASE_URL}/users/me/blocked-users`,
    {
      method: "GET",
      headers: {
        ...authHeaders(),
      },
    },
  );

  return handleResponse(response);
}

export async function reportUser(
  userId,
  {
    reason,
    details = null,
    reportId = null,
  },
) {
  const response = await fetch(
    `${API_BASE_URL}/users/${Number(userId)}/report`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        reason,
        details,
        report_id: reportId ? Number(reportId) : null,
      }),
    },
  );

  return handleResponse(response);
}


// ======================================================
// ADMIN MODERATION
// ======================================================

export async function getAdminUserReports() {
  const response = await fetch(
    `${API_BASE_URL}/users/admin/user-reports`,
    {
      method: "GET",
      headers: {
        ...authHeaders(),
      },
    },
  );

  return handleResponse(response);
}

export async function reviewAdminUserReport(
  userReportId,
  { status, resolutionNote = null },
) {
  const response = await fetch(
    `${API_BASE_URL}/users/admin/user-reports/${Number(userReportId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        status,
        resolution_note: resolutionNote,
      }),
    },
  );

  return handleResponse(response);
}
