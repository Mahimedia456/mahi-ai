import api from "./client";

export async function listChatThreads(projectId) {
  const { data } = await api.get("/chats/threads", {
    params: projectId && projectId !== "general" ? { projectId } : {},
  });
  return data.data || [];
}

export async function createChatThread(payload = {}) {
  const { data } = await api.post("/chats/threads", payload);
  return data.data;
}

export async function updateChatThread(threadId, payload = {}) {
  const { data } = await api.patch(`/chats/threads/${threadId}`, payload);
  return data.data;
}

export async function deleteChatThread(threadId) {
  const { data } = await api.delete(`/chats/threads/${threadId}`);
  return data.data;
}

export async function getChatMessages(threadId) {
  const { data } = await api.get(`/chats/threads/${threadId}/messages`);
  return data.data || [];
}

export async function sendChatMessage(threadId, payload) {
  const { data } = await api.post(`/chats/threads/${threadId}/messages`, payload);
  return data.data;
}

export function openRunStream(threadId, runId) {
  const token = localStorage.getItem("mahi_access_token");
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

  const url = `${baseUrl}/chats/threads/${threadId}/stream/${runId}?token=${encodeURIComponent(
    token || ""
  )}`;

  return new EventSource(url);
}