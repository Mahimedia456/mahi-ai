import api from "./client";

export async function listChatThreads(projectId) {
  const { data } = await api.get("/chats/threads", {
    params: projectId ? { projectId } : {},
  });
  return data.data || [];
}

export async function createChatThread(payload = {}) {
  const { data } = await api.post("/chats/threads", payload);
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

export async function updateChatThread(threadId, payload) {
  const { data } = await api.patch(`/chats/threads/${threadId}`, payload);
  return data.data;
}