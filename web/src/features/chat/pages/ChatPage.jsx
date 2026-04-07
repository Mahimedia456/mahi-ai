import { useEffect, useMemo, useRef, useState } from "react";
import {
  FolderOpen,
  Paperclip,
  Mic,
  Send,
  Settings2,
  Sparkles,
  SquareTerminal,
  Database,
  Grid2X2,
  Shield,
  CircleHelp,
  Bot,
  User,
  ChevronDown,
} from "lucide-react";
import {
  listChatThreads,
  createChatThread,
  getChatMessages,
  sendChatMessage,
  updateChatThread,
} from "../../../api/chatApi";
import { listProjects } from "../../../api/projectApi";

const emptySuggestions = [
  { icon: Sparkles, text: "What is DaVinci Resolve and what is it used for?" },
  { icon: SquareTerminal, text: "Write a professional email to a client about a delayed project." },
  { icon: Sparkles, text: "Create a blog outline for an AI productivity article." },
  { icon: Database, text: "Explain vector databases in simple words." },
  { icon: Grid2X2, text: "Help me plan features for my AI SaaS app." },
];

function SidebarIcon({ icon: Icon, label, active = false }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex h-10 w-10 items-center justify-center border ${
          active
            ? "border-mahi-accent/40 bg-mahi-accent/5 text-mahi-accent shadow-[0_0_14px_rgba(83,245,231,0.12)]"
            : "border-mahi-outlineVariant/35 bg-black text-white/45"
        }`}
      >
        <Icon size={18} strokeWidth={1.8} />
      </div>
      <span
        className={`text-[8px] font-semibold uppercase tracking-[0.16em] ${
          active ? "text-mahi-accent" : "text-white/28"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function EmptySuggestionCard({ item, onSelect }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(item.text)}
      className="theme-glass-panel flex aspect-square flex-col justify-between border border-mahi-outlineVariant/25 p-6 text-left transition-all duration-300 hover:border-mahi-accent/45"
    >
      <Icon size={18} className="text-mahi-accent/80" strokeWidth={1.8} />
      <p className="theme-heading text-sm font-medium leading-7 text-white">
        {item.text}
      </p>
    </button>
  );
}

function ChatComposer({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = "Ask anything...",
}) {
  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  }

  return (
    <div className="bg-black">
      <div className="relative group">
        <div className="relative flex items-end gap-4 border border-mahi-outlineVariant/30 bg-[#0d0d0d] p-4 transition-all focus-within:border-mahi-accent/45">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={disabled}
            className="custom-scrollbar max-h-40 flex-1 resize-none bg-transparent py-2 text-sm text-white placeholder:text-white/25 outline-none disabled:opacity-60"
          />

          <div className="flex items-center gap-4 pb-2">
            <button type="button" className="text-white/35 transition-colors hover:text-white">
              <Paperclip size={17} />
            </button>
            <button type="button" className="text-white/35 transition-colors hover:text-white">
              <Mic size={17} />
            </button>
            <button
              type="button"
              onClick={onSend}
              disabled={disabled}
              className="flex h-9 w-9 items-center justify-center bg-mahi-accent text-black transition-transform hover:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={17} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  input,
  setInput,
  startThread,
  onSuggestion,
  projects,
  selectedProjectId,
  setSelectedProjectId,
}) {
  return (
    <main className="ml-0 min-h-[calc(100vh-64px)] flex-1 bg-black md:ml-20">
      <div className="flex min-h-[calc(100vh-64px)] flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-32 pt-12">
          <div className="mb-8 max-w-5xl text-center">
            <h2 className="theme-heading text-5xl font-bold tracking-tight text-white md:text-5xl">
              What would you like to <span className="text-mahi-accent">create</span> today?
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-sm leading-8 text-white/38">
              Ask anything. Write, code, explain, brainstorm, or continue work from a project thread.
            </p>
          </div>

          <div className="mb-10 flex w-full max-w-5xl justify-center">
            <div className="flex items-center gap-3 rounded-2xl border border-mahi-outlineVariant/20 bg-[#0f0f0f] px-4 py-3">
              <FolderOpen size={16} className="text-mahi-accent" />
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-transparent text-sm text-white outline-none"
              >
                <option value="">All Projects / General Chat</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id} className="bg-[#111] text-white">
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-5">
            {emptySuggestions.map((item) => (
              <EmptySuggestionCard key={item.text} item={item} onSelect={onSuggestion} />
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-5 md:left-24 md:p-8">
          <div className="mx-auto max-w-5xl">
            <div className="theme-glass-panel theme-glow-teal rounded-lg border border-mahi-accent/60 p-2">
              <div className="flex items-center gap-4">
                <div className="pl-4 text-mahi-accent">
                  <SquareTerminal size={20} />
                </div>

                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  rows={1}
                  className="flex-1 resize-none bg-transparent py-4 text-lg tracking-tight text-white placeholder:text-white/25 outline-none"
                />

                <div className="flex items-center gap-2 pr-2">
                  <button type="button" className="p-3 text-white/35 transition-colors hover:text-white">
                    <Paperclip size={18} />
                  </button>
                  <button type="button" className="p-3 text-white/35 transition-colors hover:text-white">
                    <Mic size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={startThread}
                    className="bg-white px-8 py-3 text-sm font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-mahi-accent"
                  >
                    Execute
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 px-2 text-[10px] uppercase tracking-[0.24em] text-white/35 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mahi-accent" />
                  <span>System Ready</span>
                </div>
                <span>Context: 128k_Tokens</span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <span>Models: MAHI_ULTRA_v4</span>
                <span className="hidden h-3 w-px bg-white/15 md:block" />
                <span>Security: ENCRYPTED_TUNNEL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function AssistantMessage({ message, streaming }) {
  const content = message.content || "";
  const paragraphs = content ? content.split("\n\n") : [];

  return (
    <div className="flex gap-6 md:gap-8">
      <div className="w-8 shrink-0 pt-1">
        <Bot size={20} className="text-mahi-accent" strokeWidth={1.9} />
      </div>

      <div className="border-l border-mahi-accent/20 pl-6 md:pl-8">
        {streaming && (
          <div className="mb-4 flex items-center gap-3">
            <div className="relative h-[2px] w-12 overflow-hidden bg-mahi-accent/20">
              <div className="absolute inset-y-0 w-12 animate-[shimmer_2s_infinite] bg-mahi-accent" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-mahi-accent">
              Generating Response...
            </p>
          </div>
        )}

        <div className="space-y-4">
          {paragraphs.length ? (
            paragraphs.map((text, index) => (
              <p key={`${message.id}-${index}`} className="text-sm leading-8 text-white/88 md:text-[15px]">
                {text}
              </p>
            ))
          ) : (
            <p className="text-sm leading-8 text-white/50 md:text-[15px]">
              {streaming ? "Thinking..." : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function UserMessage({ message }) {
  return (
    <div className="ml-auto flex max-w-4xl flex-row-reverse gap-6 md:gap-8">
      <div className="flex w-8 shrink-0 justify-end pt-1">
        <User size={20} className="text-white" strokeWidth={1.9} />
      </div>

      <div className="border-r border-white/15 pr-6 text-right md:pr-8">
        <p className="text-sm leading-8 text-white md:text-[15px]">{message.content}</p>
      </div>
    </div>
  );
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

function groupThreadsByProject(threads, projects) {
  const projectMap = new Map(projects.map((project) => [project.id, project.title]));
  const grouped = new Map();

  threads.forEach((thread) => {
    const key = thread.project_id || "general";
    const label = thread.project_id ? projectMap.get(thread.project_id) || "Unknown Project" : "General";
    if (!grouped.has(key)) {
      grouped.set(key, { key, label, items: [] });
    }
    grouped.get(key).items.push(thread);
  });

  return Array.from(grouped.values());
}

function ActiveThread({
  input,
  setInput,
  onSend,
  messages,
  threads,
  projects,
  selectedProjectId,
  setSelectedProjectId,
  activeThreadId,
  onSelectThread,
  onCreateNewThread,
  onMoveThreadToProject,
  streaming,
  sending,
  loadingThreads,
  error,
}) {
  const activeThread = threads.find((thread) => thread.id === activeThreadId);
  const groupedThreads = groupThreadsByProject(threads, projects);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-black">
      <aside className="hidden w-72 shrink-0 border-r border-mahi-outlineVariant/10 bg-[#0e0e0e] lg:flex lg:flex-col">
        <div className="space-y-4 p-6">
          <button
            onClick={onCreateNewThread}
            className="w-full border border-mahi-outlineVariant/30 bg-white/[0.02] py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:border-mahi-accent/40 hover:bg-mahi-accent/5"
          >
            NEW_THREAD
          </button>

          <div className="flex items-center gap-2 rounded-xl border border-mahi-outlineVariant/20 bg-[#111111] px-3 py-2">
            <FolderOpen size={15} className="text-mahi-accent" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full bg-transparent text-[11px] uppercase tracking-[0.14em] text-white outline-none"
            >
              <option value="">All Threads</option>
              <option value="general">General Only</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id} className="bg-[#111] text-white">
                  {project.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-4 pb-4">
          {loadingThreads ? (
            <div className="px-3 py-4 text-xs text-white/45">Loading threads...</div>
          ) : error ? (
            <div className="px-3 py-4 text-xs text-red-300">{error}</div>
          ) : groupedThreads.length ? (
            groupedThreads.map((group) => (
              <div key={group.key} className="mb-5">
                <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/28">
                  {group.label}
                </div>

                <div className="space-y-1">
                  {group.items.map((thread) => {
                    const active = thread.id === activeThreadId;
                    return (
                      <button
                        key={thread.id}
                        type="button"
                        onClick={() => onSelectThread(thread.id)}
                        className={`w-full rounded-xl p-3 text-left transition-colors ${
                          active
                            ? "border-l-2 border-mahi-accent bg-white/[0.04]"
                            : "border-t border-mahi-outlineVariant/5 hover:bg-white/[0.02]"
                        }`}
                      >
                        <p
                          className={`truncate text-[11px] tracking-wide ${
                            active ? "text-white" : "text-white/52"
                          }`}
                        >
                          {thread.title || "New Chat"}
                        </p>
                        <p className="mt-1 text-[9px] text-white/28">
                          {formatThreadTime(thread.last_message_at || thread.created_at)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="px-3 py-4 text-xs text-white/45">No threads found.</div>
          )}
        </div>
      </aside>

      <main className="relative flex min-w-0 flex-1 flex-col bg-black">
        <div className="flex items-center justify-between border-b border-mahi-outlineVariant/5 px-5 py-5 md:px-10 md:py-6">
          <div>
            <h1 className="theme-heading text-x2 font-bold text-white md:text-2xl">
              {activeThread?.title || "NEW_THREAD"}
            </h1>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-mahi-accent/90">
              Process: ACTIVE // Thread: {activeThreadId?.slice(0, 8) || "NONE"}
            </p>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {activeThread && (
              <div className="flex items-center gap-2 rounded-xl border border-mahi-outlineVariant/20 bg-[#111] px-3 py-2">
                <FolderOpen size={14} className="text-mahi-accent" />
                <select
                  value={activeThread.project_id || ""}
                  onChange={(e) => onMoveThreadToProject(activeThread.id, e.target.value)}
                  className="bg-transparent text-[10px] uppercase tracking-[0.16em] text-white outline-none"
                >
                  <option value="">General</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id} className="bg-[#111] text-white">
                      {project.title}
                    </option>
                  ))}
                </select>
                <ChevronDown size={12} className="text-white/35" />
              </div>
            )}

            <button className="text-[10px] uppercase tracking-[0.16em] text-white/35 transition-colors hover:text-white">
              Export_Logs
            </button>
          </div>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-8 md:px-10 md:py-12">
          <div className="mx-auto max-w-5xl space-y-16">
            {messages.map((message) =>
              message.role === "assistant" ? (
                <AssistantMessage
                  key={message.id}
                  message={message}
                  streaming={streaming && message.status === "streaming"}
                />
              ) : (
                <UserMessage key={message.id} message={message} />
              )
            )}
          </div>
        </div>

        <div className="border-t border-mahi-outlineVariant/10 bg-black px-5 pb-6 pt-4 md:px-10 md:pb-10">
          <div className="mx-auto max-w-5xl">
            <ChatComposer
              value={input}
              onChange={setInput}
              onSend={onSend}
              disabled={sending}
              placeholder="Ask anything..."
            />

            <div className="mt-3 flex flex-col gap-3 px-1 text-[9px] uppercase tracking-[0.24em] text-white/28 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-4">
                <span>Mode: NEURAL_REASONING</span>
                <span>Token_Est: {Math.ceil((input?.length || 0) / 4)}/8192</span>
              </div>
              <span className="text-mahi-accent/60">
                {sending || streaming ? "PROCESSING" : "READY_FOR_INPUT"}
              </span>
            </div>
          </div>
        </div>
      </main>

      <aside className="hidden w-16 shrink-0 border-l border-mahi-outlineVariant/10 bg-[#0e0e0e] xl:flex xl:flex-col xl:items-center xl:py-8">
        <div className="flex flex-col items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-mahi-accent animate-pulse" />
          <div className="h-1 w-1 rounded-full bg-mahi-accent/50" />
          <div className="h-1 w-1 rounded-full bg-mahi-accent/20" />
        </div>

        <div className="mt-12 [writing-mode:vertical-lr]">
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/24">
            SYS_LATENCY: 14MS GPU_LOAD: 42%
          </span>
        </div>

        <div className="mt-auto pb-4 text-white/30">
          <CircleHelp size={18} />
        </div>
      </aside>
    </div>
  );
}

function normalizeMessage(message) {
  return {
    id: message.id,
    role: message.role,
    content: message.content || "",
    status: message.status || "completed",
  };
}

export default function ChatPage() {
  const [mode, setMode] = useState("empty");
  const [input, setInput] = useState("");
  const [threads, setThreads] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [error, setError] = useState("");
  const pollIntervalRef = useRef(null);

  const filteredThreads = useMemo(() => {
    if (!selectedProjectId) return threads;
    if (selectedProjectId === "general") {
      return threads.filter((thread) => !thread.project_id);
    }
    return threads.filter((thread) => thread.project_id === selectedProjectId);
  }, [threads, selectedProjectId]);

  async function loadProjects() {
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

    const hasStreaming = normalized.some(
      (item) => item.role === "assistant" && item.status === "streaming"
    );
    setStreaming(hasStreaming);
    return normalized;
  }

  function stopPolling() {
    if (pollIntervalRef.current) {
      window.clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }

  function startPolling(threadId) {
    stopPolling();

    pollIntervalRef.current = window.setInterval(async () => {
      const freshMessages = await loadMessages(threadId);
      const stillStreaming = freshMessages.some(
        (item) => item.role === "assistant" && item.status === "streaming"
      );

      if (!stillStreaming) {
        stopPolling();
        setStreaming(false);
        await loadThreads(threadId);
      }
    }, 1500);
  }

  useEffect(() => {
    loadProjects();
    loadThreads();

    return () => stopPolling();
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

  async function handleCreateNewThread() {
    setMode("empty");
    setActiveThreadId(null);
    setMessages([]);
    setInput("");
    setStreaming(false);
    stopPolling();
  }

  async function handleSelectThread(threadId) {
    setActiveThreadId(threadId);
    setMode("thread");
    await loadMessages(threadId);
  }

  async function handleMoveThreadToProject(threadId, projectId) {
    try {
      await updateChatThread(threadId, {
        projectId: projectId || null,
      });

      const nextProjectFilter = selectedProjectId === "general" && projectId ? "" : selectedProjectId;
      if (nextProjectFilter !== selectedProjectId) {
        setSelectedProjectId(nextProjectFilter);
      }
      await loadThreads(threadId, nextProjectFilter);
    } catch (err) {
      console.error("Failed to move thread:", err);
    }
  }

  async function startThread() {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    try {
      setSending(true);

      const thread = await createChatThread({
        title: trimmed.slice(0, 60),
        mode: "chat",
        projectId: selectedProjectId && selectedProjectId !== "general" ? selectedProjectId : null,
      });

      setActiveThreadId(thread.id);
      setMode("thread");

      const result = await sendChatMessage(thread.id, {
        content: trimmed,
      });

      setInput("");
      setMessages([
        normalizeMessage(result.userMessage),
        normalizeMessage(result.assistantMessage),
      ]);
      setStreaming(true);
      startPolling(thread.id);
      await loadThreads(thread.id);
    } catch (err) {
      console.error("Failed to start thread:", err);
      setError("Unable to start a new chat.");
    } finally {
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

      const optimisticAssistant = {
        id: `temp-assistant-${Date.now()}`,
        role: "assistant",
        content: "",
        status: "streaming",
      };

      setMessages((prev) => [...prev, optimisticUser, optimisticAssistant]);
      setInput("");
      setStreaming(true);

      const result = await sendChatMessage(activeThreadId, {
        content: trimmed,
      });

      setMessages((prev) => {
        const cleaned = prev.filter((item) => !String(item.id).startsWith("temp-"));
        return [
          ...cleaned,
          normalizeMessage(result.userMessage),
          normalizeMessage(result.assistantMessage),
        ];
      });

      startPolling(activeThreadId);
      await loadThreads(activeThreadId);
    } catch (err) {
      console.error("Failed to send message:", err);
      setStreaming(false);
      await loadMessages(activeThreadId);
    } finally {
      setSending(false);
    }
  }

  function handleSuggestion(text) {
    setInput(text);
  }

  return (
    <div className="relative">
      <div className="fixed bottom-6 left-5 z-30 hidden flex-col gap-5 md:flex md:left-6 md:top-24 md:bottom-auto">
        <SidebarIcon icon={Sparkles} label="Thread" active />
        <SidebarIcon icon={Database} label="Mem" />
        <SidebarIcon icon={Grid2X2} label="Grid" />
        <SidebarIcon icon={SquareTerminal} label="Logs" />
      </div>

      <div className="fixed bottom-6 left-5 z-30 hidden flex-col gap-5 md:flex md:left-6 md:bottom-6 md:top-auto">
        <div className="text-white/30">
          <Shield size={18} />
        </div>
        <div className="text-white/30">
          <Settings2 size={18} />
        </div>
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-mahi-outlineVariant/35 bg-[#121212] text-[11px] font-bold text-mahi-accent">
          A
        </div>
      </div>

      {mode === "empty" ? (
        <EmptyState
          input={input}
          setInput={setInput}
          startThread={startThread}
          onSuggestion={handleSuggestion}
          projects={projects}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
        />
      ) : (
        <ActiveThread
          input={input}
          setInput={setInput}
          onSend={sendInThread}
          messages={messages}
          threads={filteredThreads}
          projects={projects}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          activeThreadId={activeThreadId}
          onSelectThread={handleSelectThread}
          onCreateNewThread={handleCreateNewThread}
          onMoveThreadToProject={handleMoveThreadToProject}
          streaming={streaming}
          sending={sending}
          loadingThreads={loadingThreads}
          error={error}
        />
      )}
    </div>
  );
}