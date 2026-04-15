import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  Check,
  Code2,
  FolderOpen,
  FolderPlus,
  Image as ImageIcon,
  LoaderCircle,
  MessageSquareText,
  MoreHorizontal,
  Pencil,
  Plus,
  Rabbit,
  Send,
  Trash2,
  X,
  User,
} from "lucide-react";
import {
  listChatThreads,
  createChatThread,
  updateChatThread,
  deleteChatThread,
  getChatMessages,
  sendChatMessage,
  openRunStream,
} from "../../../api/chatApi";
import {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../../api/projectApi";

const CHAT_MODES = [
  { key: "chat", label: "Chat", icon: MessageSquareText },
  { key: "code", label: "Code", icon: Code2 },
  { key: "fast", label: "Fast", icon: Rabbit },
  { key: "image", label: "Image", icon: ImageIcon },
];

const IMAGE_DEFAULTS = {
  model: "realvisxl",
  options: {
    width: 1024,
    height: 1024,
    steps: 30,
    guidance: 6,
    quality: "high",
  },
};

function normalizeMessage(message) {
  return {
    id: message.id || `msg-${Math.random().toString(36).slice(2)}`,
    role: message.role,
    content: message.content || "",
    content_json: message.content_json || {},
    kind: message.kind || "text",
    status: message.status || "completed",
    progress: "",
  };
}

function formatThreadTime(value) {
  if (!value) return "";
  const now = Date.now();
  const date = new Date(value).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Date(value).toLocaleDateString();
}

function buildMessagePayload({ content, mode }) {
  if (mode === "image") {
    return {
      content,
      mode,
      model: IMAGE_DEFAULTS.model,
      options: { ...IMAGE_DEFAULTS.options },
    };
  }

  return {
    content,
    mode,
  };
}

function ModeSelector({ value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {CHAT_MODES.map((item) => {
        const Icon = item.icon;
        const active = value === item.key;

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium transition ${
              active
                ? "border-mahi-accent/40 bg-mahi-accent/10 text-mahi-accent"
                : "border-white/10 bg-white/[0.02] text-white/70 hover:text-white"
            }`}
          >
            <Icon size={14} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function Composer({ value, onChange, onSend, disabled, mode }) {
  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  }

  const placeholder =
    mode === "code"
      ? "Ask for code, debugging, refactors..."
      : mode === "fast"
      ? "Ask for a quick answer..."
      : mode === "image"
      ? "Describe the image you want to generate..."
      : "Message Mahi AI...";

  return (
    <div className="border-t border-mahi-outlineVariant/10 bg-[#090909] px-4 py-4 md:px-6">
      <div className="mx-auto max-w-5xl rounded-3xl border border-mahi-outlineVariant/20 bg-[#111111] p-3">
        <div className="flex items-end gap-3">
          <textarea
            rows={1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="custom-scrollbar max-h-52 min-h-[52px] flex-1 resize-none bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-white/30 disabled:opacity-60"
          />

          <button
            type="button"
            onClick={onSend}
            disabled={disabled || !value.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mahi-accent text-black transition hover:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={18} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
}

function AssistantMessage({ message }) {
  const content = message.content || "";
  const streaming = message.status === "streaming";
  const paragraphs = content ? content.split("\n\n") : [];
  const imageUrl =
    message.content_json?.imageUrl ||
    message.content_json?.url ||
    message.content_json?.output_url ||
    null;

  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-mahi-accent/20 bg-mahi-accent/5">
        <Bot size={18} className="text-mahi-accent" />
      </div>

      <div className="min-w-0 flex-1">
        {streaming && (
          <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-mahi-accent/80">
            <LoaderCircle size={12} className="animate-spin" />
            {message.progress || "Typing"}
          </div>
        )}

        {imageUrl ? (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-3">
            <img
              src={imageUrl}
              alt="Generated"
              className="w-full rounded-2xl object-cover"
            />

            {(message.content_json?.model ||
              message.content_json?.width ||
              message.content_json?.height ||
              message.content_json?.steps) && (
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white/45">
                {message.content_json?.model ? (
                  <span className="rounded-full border border-white/10 px-2 py-1">
                    {message.content_json.model}
                  </span>
                ) : null}
                {message.content_json?.width && message.content_json?.height ? (
                  <span className="rounded-full border border-white/10 px-2 py-1">
                    {message.content_json.width}×{message.content_json.height}
                  </span>
                ) : null}
                {message.content_json?.steps ? (
                  <span className="rounded-full border border-white/10 px-2 py-1">
                    {message.content_json.steps} steps
                  </span>
                ) : null}
                {message.content_json?.quality ? (
                  <span className="rounded-full border border-white/10 px-2 py-1">
                    {message.content_json.quality}
                  </span>
                ) : null}
              </div>
            )}

            {content ? (
              <p className="mt-3 whitespace-pre-wrap text-[14px] leading-7 text-white/80">
                {content}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="space-y-4">
            {paragraphs.length ? (
              paragraphs.map((text, index) => (
                <p
                  key={`${message.id}-${index}`}
                  className="whitespace-pre-wrap text-[15px] leading-8 text-white/90"
                >
                  {text}
                </p>
              ))
            ) : (
              <p className="text-[15px] leading-8 text-white/50">
                {streaming ? message.progress || "Thinking..." : ""}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function UserMessage({ message }) {
  return (
    <div className="ml-auto flex max-w-4xl flex-row-reverse gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
        <User size={18} className="text-white" />
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-4">
        <p className="whitespace-pre-wrap text-[15px] leading-8 text-white">
          {message.content}
        </p>
      </div>
    </div>
  );
}

function ProjectManagerModal({
  open,
  onClose,
  projects,
  onCreate,
  onRename,
  onDelete,
}) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    if (!open) {
      setNewName("");
      setEditingId(null);
      setEditingName("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-[28px] border border-mahi-outlineVariant/20 bg-[#101010] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="theme-heading text-2xl font-bold text-white">
              Manage Projects
            </h3>
            <p className="mt-1 text-sm text-white/45">
              Create, rename, and delete projects.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 p-2 text-white/60 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-6 flex gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New project name"
            className="h-12 flex-1 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25"
          />
          <button
            type="button"
            onClick={async () => {
              const value = newName.trim();
              if (!value) return;
              await onCreate(value);
              setNewName("");
            }}
            className="inline-flex h-12 items-center gap-2 rounded-2xl bg-mahi-accent px-5 text-sm font-semibold text-black"
          >
            <Plus size={16} />
            Create
          </button>
        </div>

        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
            >
              <FolderOpen size={16} className="text-mahi-accent" />

              {editingId === project.id ? (
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="h-10 flex-1 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white outline-none"
                />
              ) : (
                <div className="flex-1 text-sm text-white">
                  {project.name || project.title}
                </div>
              )}

              {editingId === project.id ? (
                <>
                  <button
                    type="button"
                    onClick={async () => {
                      const value = editingName.trim();
                      if (!value) return;
                      await onRename(project.id, value);
                      setEditingId(null);
                      setEditingName("");
                    }}
                    className="rounded-xl border border-mahi-accent/20 p-2 text-mahi-accent"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setEditingName("");
                    }}
                    className="rounded-xl border border-white/10 p-2 text-white/60"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(project.id);
                      setEditingName(project.name || project.title || "");
                    }}
                    className="rounded-xl border border-white/10 p-2 text-white/70 hover:text-white"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(project.id)}
                    className="rounded-xl border border-red-500/20 p-2 text-red-300 hover:text-red-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          ))}

          {!projects.length && (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-white/40">
              No projects yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [mode, setMode] = useState("empty");
  const [activeMode, setActiveMode] = useState("chat");
  const [input, setInput] = useState("");
  const [threads, setThreads] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [error, setError] = useState("");
  const [threadMenuId, setThreadMenuId] = useState(null);
  const [renamingThreadId, setRenamingThreadId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [projectModalOpen, setProjectModalOpen] = useState(false);

  const streamRef = useRef(null);
  const messagesEndRef = useRef(null);

  const filteredThreads = useMemo(() => {
    if (!selectedProjectId) return threads;
    if (selectedProjectId === "general") {
      return threads.filter((thread) => !thread.project_id);
    }
    return threads.filter((thread) => thread.project_id === selectedProjectId);
  }, [threads, selectedProjectId]);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) || null,
    [threads, activeThreadId]
  );

  function closeStream() {
    if (streamRef.current) {
      streamRef.current.close();
      streamRef.current = null;
    }
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }

  async function loadProjectsList() {
    try {
      const data = await listProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects:", err);
    }
  }

  async function loadThreads(preferredThreadId = null, projectFilter = selectedProjectId) {
    try {
      setLoadingThreads(true);
      setError("");

      const data =
        projectFilter && projectFilter !== "general"
          ? await listChatThreads(projectFilter)
          : await listChatThreads();

      const normalized =
        projectFilter === "general"
          ? data.filter((thread) => !thread.project_id)
          : data;

      setThreads(normalized);

      if (normalized.length) {
        const nextThreadId =
          preferredThreadId && normalized.some((item) => item.id === preferredThreadId)
            ? preferredThreadId
            : activeThreadId && normalized.some((item) => item.id === activeThreadId)
            ? activeThreadId
            : normalized[0].id;

        if (nextThreadId) {
          setActiveThreadId(nextThreadId);
          setMode("thread");
        }
      } else {
        setActiveThreadId(null);
        setMessages([]);
        setMode("empty");
      }
    } catch (err) {
      console.error("Failed to load threads:", err);
      setError("Unable to load chat threads.");
    } finally {
      setLoadingThreads(false);
    }
  }

  async function loadMessages(threadId) {
    if (!threadId) return [];
    const data = await getChatMessages(threadId);
    const normalized = data.map(normalizeMessage);
    setMessages(normalized);
    return normalized;
  }

  useEffect(() => {
    loadProjectsList();
    loadThreads();

    return () => closeStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadThreads(null, selectedProjectId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectId]);

  useEffect(() => {
    if (activeThreadId) {
      loadMessages(activeThreadId);
    }
  }, [activeThreadId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (activeThread?.mode) {
      setActiveMode(activeThread.mode);
    }
  }, [activeThread]);

  async function handleCreateProject(name) {
    await createProject({ name });
    await loadProjectsList();
  }

  async function handleRenameProject(projectId, name) {
    await updateProject(projectId, { name });
    await loadProjectsList();
    await loadThreads(activeThreadId, selectedProjectId);
  }

  async function handleDeleteProject(projectId) {
    await deleteProject(projectId);

    if (selectedProjectId === projectId) {
      setSelectedProjectId("");
    }

    await loadProjectsList();
    await loadThreads(activeThreadId, selectedProjectId === projectId ? "" : selectedProjectId);
  }

  async function handleCreateNewThread() {
    closeStream();
    setMode("empty");
    setActiveThreadId(null);
    setMessages([]);
    setInput("");
    setThreadMenuId(null);
  }

  async function handleSelectThread(threadId) {
    closeStream();
    setThreadMenuId(null);
    setActiveThreadId(threadId);
    setMode("thread");
    await loadMessages(threadId);
  }

  async function handleMoveThreadToProject(threadId, projectId) {
    await updateChatThread(threadId, {
      projectId: projectId || null,
    });

    setThreadMenuId(null);

    const nextProjectFilter =
      selectedProjectId === "general" && projectId ? "" : selectedProjectId;

    if (nextProjectFilter !== selectedProjectId) {
      setSelectedProjectId(nextProjectFilter);
    }

    await loadThreads(threadId, nextProjectFilter);
  }

  async function handleRenameThread(threadId, title) {
    const value = title.trim();
    if (!value) return;

    await updateChatThread(threadId, { title: value });
    setRenamingThreadId(null);
    setRenameValue("");
    await loadThreads(threadId, selectedProjectId);
  }

  async function handleDeleteThread(threadId) {
    await deleteChatThread(threadId);
    setThreadMenuId(null);

    const remaining = filteredThreads.filter((thread) => thread.id !== threadId);
    const nextThreadId = remaining[0]?.id || null;

    if (activeThreadId === threadId) {
      setActiveThreadId(nextThreadId);
      if (nextThreadId) {
        await loadMessages(nextThreadId);
        setMode("thread");
      } else {
        setMessages([]);
        setMode("empty");
      }
    }

    await loadThreads(nextThreadId, selectedProjectId);
  }

  function startRunStream(threadId, runId, assistantMessageId) {
    closeStream();

    const source = openRunStream(threadId, runId);
    streamRef.current = source;

    source.addEventListener("ready", (event) => {
      try {
        const payload = JSON.parse(event.data);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  status: "streaming",
                  progress: payload.message || "Preparing answer",
                  content: msg.content || "",
                }
              : msg
          )
        );
      } catch (err) {
        console.error("Ready stream parse error:", err);
      }
    });

    source.addEventListener("progress", (event) => {
      try {
        const payload = JSON.parse(event.data);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  status: "streaming",
                  progress: payload.message || "Working...",
                }
              : msg
          )
        );
      } catch (err) {
        console.error("Progress stream parse error:", err);
      }
    });

    source.addEventListener("delta", (event) => {
      try {
        const payload = JSON.parse(event.data);

        if (payload.type !== "delta" || !payload.token) return;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: (msg.content || "") + payload.token,
                  status: "streaming",
                  progress: "Typing",
                }
              : msg
          )
        );
      } catch (err) {
        console.error("Delta stream parse error:", err);
      }
    });

    source.addEventListener("complete", async (event) => {
      try {
        const payload = JSON.parse(event.data);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: payload.content ?? msg.content,
                  content_json: payload.contentJson ?? msg.content_json,
                  status: "completed",
                  progress: "",
                }
              : msg
          )
        );
      } catch (err) {
        console.error("Complete stream parse error:", err);
      } finally {
        closeStream();
        await loadMessages(threadId);
        await loadThreads(threadId, selectedProjectId);
        setSending(false);
      }
    });

    source.addEventListener("error", async (event) => {
      try {
        if (event?.data) {
          const payload = JSON.parse(event.data);

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    content: payload.message || "Something went wrong.",
                    status: "failed",
                    progress: "",
                  }
                : msg
            )
          );
        }
      } catch (err) {
        console.error("Error stream parse error:", err);
      } finally {
        closeStream();
        await loadMessages(threadId);
        await loadThreads(threadId, selectedProjectId);
        setSending(false);
      }
    });

    source.onerror = async () => {
      closeStream();
      await loadMessages(threadId);
      await loadThreads(threadId, selectedProjectId);
      setSending(false);
    };
  }

  async function startThread() {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    try {
      setSending(true);

      const thread = await createChatThread({
        title: trimmed.slice(0, 80),
        mode: activeMode,
        projectId:
          selectedProjectId && selectedProjectId !== "general"
            ? selectedProjectId
            : null,
      });

      setActiveThreadId(thread.id);
      setMode("thread");

      const result = await sendChatMessage(
        thread.id,
        buildMessagePayload({
          content: trimmed,
          mode: activeMode,
        })
      );

      setInput("");
      setMessages([
        normalizeMessage(result.userMessage),
        normalizeMessage(result.assistantMessage),
      ]);

      await loadThreads(thread.id, selectedProjectId);

      if (result.run?.id && result.assistantMessage?.id) {
        startRunStream(thread.id, result.run.id, result.assistantMessage.id);
      } else {
        await loadMessages(thread.id);
        setSending(false);
      }
    } catch (err) {
      console.error("Failed to start thread:", err);
      setError("Unable to start a new chat.");
      setSending(false);
    }
  }

  async function sendInThread() {
    const trimmed = input.trim();
    if (!trimmed || sending || !activeThreadId) return;

    try {
      setSending(true);

      const optimisticUser = {
        id: `temp-user-${Date.now()}`,
        role: "user",
        content: trimmed,
        status: "completed",
      };

      setMessages((prev) => [...prev, optimisticUser]);
      setInput("");

      const result = await sendChatMessage(
        activeThreadId,
        buildMessagePayload({
          content: trimmed,
          mode: activeMode,
        })
      );

      setMessages((prev) => {
        const withoutTempUser = prev.filter((item) => item.id !== optimisticUser.id);
        return [
          ...withoutTempUser,
          normalizeMessage(result.userMessage),
          normalizeMessage(result.assistantMessage),
        ];
      });

      await loadThreads(activeThreadId, selectedProjectId);

      if (result.run?.id && result.assistantMessage?.id) {
        startRunStream(activeThreadId, result.run.id, result.assistantMessage.id);
      } else {
        await loadMessages(activeThreadId);
        setSending(false);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setSending(false);
      await loadMessages(activeThreadId);
    }
  }

  const onSend = mode === "empty" ? startThread : sendInThread;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-black">
      <aside className="hidden w-80 shrink-0 border-r border-mahi-outlineVariant/10 bg-[#0b0b0b] lg:flex lg:flex-col">
        <div className="border-b border-mahi-outlineVariant/10 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="theme-heading text-xl font-bold text-white">Chats</h2>
              <p className="mt-1 text-xs text-white/40">Organize by project</p>
            </div>

            <button
              type="button"
              onClick={() => setProjectModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-white/70 hover:text-white"
            >
              <FolderPlus size={15} />
              Projects
            </button>
          </div>

          <button
            type="button"
            onClick={handleCreateNewThread}
            className="mb-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-mahi-accent text-sm font-semibold text-black"
          >
            <Plus size={16} />
            New chat
          </button>

          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] px-3">
            <FolderOpen size={15} className="text-mahi-accent" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="h-12 w-full bg-transparent text-sm text-white outline-none"
            >
              <option value="">All threads</option>
              <option value="general">General only</option>
              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                  className="bg-[#111111] text-white"
                >
                  {project.name || project.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto p-3">
          {loadingThreads ? (
            <div className="px-3 py-4 text-sm text-white/45">Loading threads...</div>
          ) : error ? (
            <div className="px-3 py-4 text-sm text-red-300">{error}</div>
          ) : filteredThreads.length ? (
            <div className="space-y-2">
              {filteredThreads.map((thread) => {
                const active = thread.id === activeThreadId;
                const isRenaming = renamingThreadId === thread.id;

                return (
                  <div
                    key={thread.id}
                    className={`relative rounded-2xl border ${
                      active
                        ? "border-mahi-accent/30 bg-mahi-accent/5"
                        : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-start gap-2 p-3">
                      <button
                        type="button"
                        onClick={() => handleSelectThread(thread.id)}
                        className="min-w-0 flex-1 text-left"
                      >
                        {isRenaming ? (
                          <input
                            autoFocus
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onBlur={() => handleRenameThread(thread.id, renameValue)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleRenameThread(thread.id, renameValue);
                              }
                            }}
                            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
                          />
                        ) : (
                          <>
                            <p className="truncate text-sm font-medium text-white">
                              {thread.title || "New Chat"}
                            </p>
                            <p className="mt-1 text-xs text-white/35">
                              {formatThreadTime(thread.last_message_at || thread.created_at)}
                            </p>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setThreadMenuId((prev) => (prev === thread.id ? null : thread.id))
                        }
                        className="rounded-xl border border-white/10 p-2 text-white/55 hover:text-white"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>

                    {threadMenuId === thread.id && (
                      <div className="absolute right-3 top-12 z-20 w-56 rounded-2xl border border-white/10 bg-[#111111] p-2 shadow-xl">
                        <button
                          type="button"
                          onClick={() => {
                            setRenamingThreadId(thread.id);
                            setRenameValue(thread.title || "");
                            setThreadMenuId(null);
                          }}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white/80 hover:bg-white/[0.04]"
                        >
                          <Pencil size={15} />
                          Rename
                        </button>

                        <div className="my-2 border-t border-white/10" />

                        <div className="px-3 pb-2 pt-1 text-[11px] uppercase tracking-[0.14em] text-white/35">
                          Move to project
                        </div>

                        <button
                          type="button"
                          onClick={() => handleMoveThreadToProject(thread.id, "")}
                          className="block w-full rounded-xl px-3 py-2 text-left text-sm text-white/80 hover:bg-white/[0.04]"
                        >
                          General
                        </button>

                        {projects.map((project) => (
                          <button
                            key={project.id}
                            type="button"
                            onClick={() => handleMoveThreadToProject(thread.id, project.id)}
                            className="block w-full rounded-xl px-3 py-2 text-left text-sm text-white/80 hover:bg-white/[0.04]"
                          >
                            {project.name || project.title}
                          </button>
                        ))}

                        <div className="my-2 border-t border-white/10" />

                        <button
                          type="button"
                          onClick={() => handleDeleteThread(thread.id)}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-3 py-6 text-sm text-white/45">No threads found.</div>
          )}
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-mahi-outlineVariant/10 bg-[#0b0b0b] px-4 py-4 md:px-6">
          <div className="mx-auto max-w-5xl space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h1 className="truncate theme-heading text-2xl font-bold text-white">
                  {activeThread?.title || "New chat"}
                </h1>
                <p className="mt-1 text-sm text-white/40">
                  {activeThread?.project_id
                    ? projects.find((item) => item.id === activeThread.project_id)?.name ||
                      "Project thread"
                    : "General chat"}
                </p>
              </div>

              <div className="hidden md:block">
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="h-11 rounded-2xl border border-white/10 bg-white/[0.02] px-4 text-sm text-white outline-none"
                >
                  <option value="">All threads</option>
                  <option value="general">General only</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id} className="bg-[#111111] text-white">
                      {project.name || project.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <ModeSelector value={activeMode} onChange={setActiveMode} />
          </div>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto max-w-5xl space-y-8">
            {mode === "empty" && !messages.length ? (
              <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-mahi-accent/20 bg-mahi-accent/5">
                  <Bot size={28} className="text-mahi-accent" />
                </div>
                <h2 className="theme-heading text-4xl font-bold text-white">
                  What do you want to create today?
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45">
                  One workspace for chat, code, fast answers, and image generation.
                </p>
              </div>
            ) : (
              <>
                {messages.map((message) =>
                  message.role === "assistant" ? (
                    <AssistantMessage key={message.id} message={message} />
                  ) : (
                    <UserMessage key={message.id} message={message} />
                  )
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        <Composer
          value={input}
          onChange={setInput}
          onSend={onSend}
          disabled={sending || (mode === "thread" && !activeThreadId)}
          mode={activeMode}
        />
      </main>

      <ProjectManagerModal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        projects={projects}
        onCreate={handleCreateProject}
        onRename={handleRenameProject}
        onDelete={handleDeleteProject}
      />

      {sending && (
        <div className="fixed right-6 top-24 z-40 hidden items-center gap-2 rounded-full border border-mahi-accent/20 bg-[#111]/90 px-4 py-2 text-xs text-white/85 shadow-lg md:flex">
          <LoaderCircle size={14} className="animate-spin text-mahi-accent" />
          <span>
            {activeMode === "image"
              ? "Generating RealVisXL image..."
              : "Generating..."}
          </span>
        </div>
      )}
    </div>
  );
}