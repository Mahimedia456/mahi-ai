import { useMemo, useState } from "react";
import {
  ArrowUpRight,
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
  PlusSquare,
  Trash2,
} from "lucide-react";

const emptySuggestions = [
  {
    icon: Sparkles,
    text: "Generate technical schematics for a modular lunar habitat",
  },
  {
    icon: SquareTerminal,
    text: "Refactor Python backend for optimized vector database retrieval",
  },
  {
    icon: Sparkles,
    text: "Synthesize an editorial concept for a digital fashion magazine",
  },
  {
    icon: Database,
    text: "Analyze market sentiment patterns for synthetic commodities",
  },
  {
    icon: Grid2X2,
    text: "Create a custom prompt sequence for multi-agent simulation",
  },
];

const threadList = [
  { title: "QUANTUM_CRYPTOGRAPHY_ANALYSIS", time: "2m ago", active: true },
  { title: "NEURAL_NETWORK_OPTIMIZATION", time: "1h ago" },
  { title: "SYSTEM_RECOVERY_PROTOCOL_V4", time: "5h ago" },
  { title: "API_INTEGRATION_TESTS", time: "Yesterday" },
  { title: "ARCHIVE_DECRYPTION_LOGS", time: "Oct 24" },
];

const sampleMessages = [
  {
    role: "assistant",
    type: "text",
    content:
      'Session initialized. I have completed the preliminary scan of the encrypted quantum volume. The lattice-based encryption appears to be using a modified Kyber-768 implementation.\n\nWould you like me to begin the HEURISTIC_RECONSTRUCTION or should I focus on isolating the entropy leakage in the secondary keys?',
    actions: ["Isolate_Entropy", "Begin_Reconstruction"],
  },
  {
    role: "user",
    type: "text",
    content:
      "Proceed with entropy isolation. I suspect the leakage is originating from the noise distribution generator. Can you verify the Gaussian parameters used in the initial handshake?",
    meta: "14:02_UTC",
  },
  {
    role: "assistant",
    type: "analysis",
    label: "Analyzing_Gaussian_Parameters...",
    content:
      "Verified. The standard deviation σ is fluctuating between 3.12 and 3.45. This confirms a non-constant noise injection, which is highly atypical for a standard Kyber implementation.",
    code: `[SYSTEM_ANALYSIS]
> ENTROPY_SOURCE: /dev/qrng_01
> FLUCTUATION_DELTA: 0.33
> RISK_LEVEL: CRITICAL
> RECOMMENDATION: RESET_NOISE_FLOOR`,
  },
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

function EmptySuggestionCard({ item }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      className="theme-glass-panel flex aspect-square flex-col justify-between border border-mahi-outlineVariant/25 p-6 text-left transition-all duration-300 hover:border-mahi-accent/45"
    >
      <Icon size={18} className="text-mahi-accent/80" strokeWidth={1.8} />
      <p className="theme-heading text-sm font-medium leading-7 text-white">
        {item.text}
      </p>
    </button>
  );
}

function ChatComposer({ value, onChange, onSend, placeholder = "Input command or query..." }) {
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
            className="custom-scrollbar max-h-40 flex-1 resize-none bg-transparent py-2 text-sm text-white placeholder:text-white/25 outline-none"
          />

          <div className="flex items-center gap-4 pb-2">
            <button
              type="button"
              className="text-white/35 transition-colors hover:text-white"
            >
              <Paperclip size={17} />
            </button>
            <button
              type="button"
              className="text-white/35 transition-colors hover:text-white"
            >
              <Mic size={17} />
            </button>
            <button
              type="button"
              onClick={onSend}
              className="flex h-9 w-9 items-center justify-center bg-mahi-accent text-black transition-transform hover:scale-[0.97]"
            >
              <Send size={17} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ input, setInput, startThread }) {
  return (
    <main className="ml-0 min-h-[calc(100vh-64px)] flex-1 bg-black md:ml-20">
      <div className="flex min-h-[calc(100vh-64px)] flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-32 pt-12">
          <div className="mb-16 max-w-5xl text-center">
            <h2 className="theme-heading text-5xl font-bold tracking-tight text-white md:text-5xl">
              What would you like to <span className="text-mahi-accent">create</span>{" "}
              today?
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-sm leading-8 text-white/38">
              Initiate a new neural thread or browse your system memory to
              continue previous computations.
            </p>
          </div>

          <div className="grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-5">
            {emptySuggestions.map((item) => (
              <EmptySuggestionCard key={item.text} item={item} />
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
                  placeholder="ENTER_NEURAL_COMMAND..."
                  rows={1}
                  className="flex-1 resize-none bg-transparent py-4 text-lg tracking-tight text-white placeholder:text-white/25 outline-none"
                />

                <div className="flex items-center gap-2 pr-2">
                  <button
                    type="button"
                    className="p-3 text-white/35 transition-colors hover:text-white"
                  >
                    <Paperclip size={18} />
                  </button>
                  <button
                    type="button"
                    className="p-3 text-white/35 transition-colors hover:text-white"
                  >
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
  const paragraphs = message.content.split("\n\n");

  return (
    <div className="flex gap-6 md:gap-8">
      <div className="w-8 shrink-0 pt-1">
        <Bot size={20} className="text-mahi-accent" strokeWidth={1.9} />
      </div>

      <div className="border-l border-mahi-accent/20 pl-6 md:pl-8">
        {message.type === "analysis" && (
          <div className="mb-4 flex items-center gap-3">
            <div className="relative h-[2px] w-12 overflow-hidden bg-mahi-accent/20">
              <div
                className={`absolute inset-y-0 w-12 bg-mahi-accent ${
                  streaming ? "animate-[shimmer_2s_infinite]" : ""
                }`}
              />
            </div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-mahi-accent">
              {message.label}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {paragraphs.map((text) => (
            <p key={text} className="text-sm leading-8 text-white/88 md:text-[15px]">
              {text}
            </p>
          ))}
        </div>

        {message.actions?.length ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {message.actions.map((action, index) => (
              <button
                key={action}
                type="button"
                className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-all ${
                  index === 0
                    ? "border border-mahi-accent/30 bg-[#101717] text-mahi-accent hover:bg-mahi-accent hover:text-black"
                    : "border border-mahi-outlineVariant/30 bg-[#111111] text-white/45 hover:border-white/40 hover:text-white"
                }`}
              >
                {action}
              </button>
            ))}
          </div>
        ) : null}

        {message.code ? (
          <div className="mt-6 border border-mahi-outlineVariant/20 bg-[#0d0d0d] p-6">
            <pre className="whitespace-pre-wrap text-xs leading-8 text-mahi-accent/85">
              {message.code}
            </pre>
          </div>
        ) : null}
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
        <p className="text-sm leading-8 text-white md:text-[15px]">
          {message.content}
        </p>

        {message.meta ? (
          <div className="mt-4 text-[10px] uppercase tracking-[0.22em] text-white/28">
            {message.meta}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ActiveThread({ input, setInput, onSend, messages, streaming }) {
  return (
    <div className="flex h-[calc(100vh-64px)] bg-black">
      <aside className="hidden w-64 shrink-0 border-r border-mahi-outlineVariant/10 bg-[#0e0e0e] lg:flex lg:flex-col">
        <div className="p-6">
          <button className="w-full border border-mahi-outlineVariant/30 bg-white/[0.02] py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:border-mahi-accent/40 hover:bg-mahi-accent/5">
            NEW_THREAD
          </button>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-4">
          <div className="space-y-1">
            {threadList.map((thread) => (
              <button
                key={thread.title}
                type="button"
                className={`w-full p-3 text-left transition-colors ${
                  thread.active
                    ? "border-l-2 border-mahi-accent bg-white/[0.04]"
                    : "border-t border-mahi-outlineVariant/5 hover:bg-white/[0.02]"
                }`}
              >
                <p
                  className={`truncate text-[11px] tracking-wide ${
                    thread.active ? "text-white" : "text-white/52"
                  }`}
                >
                  {thread.title}
                </p>
                <p className="mt-1 text-[9px] text-white/28">{thread.time}</p>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="relative flex min-w-0 flex-1 flex-col bg-black">
        <div className="flex items-center justify-between border-b border-mahi-outlineVariant/5 px-5 py-5 md:px-10 md:py-6">
          <div>
            <h1 className="theme-heading text-x2 font-bold text-white md:text-2xl">
              QUANTUM_CRYPTOGRAPHY_ANALYSIS
            </h1>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-mahi-accent/90">
              Process: ACTIVE // Thread: 0x882_K
            </p>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <button className="text-[10px] uppercase tracking-[0.16em] text-white/35 transition-colors hover:text-white">
              Export_Logs
            </button>
            <button className="text-[10px] uppercase tracking-[0.16em] text-white/35 transition-colors hover:text-white">
              Wipe_Cache
            </button>
          </div>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-8 md:px-10 md:py-12">
          <div className="mx-auto max-w-5xl space-y-16">
            {messages.map((message, index) =>
              message.role === "assistant" ? (
                <AssistantMessage
                  key={`${message.role}-${index}`}
                  message={message}
                  streaming={streaming && index === messages.length - 1}
                />
              ) : (
                <UserMessage
                  key={`${message.role}-${index}`}
                  message={message}
                />
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
              placeholder="Input command or query..."
            />

            <div className="mt-3 flex flex-col gap-3 px-1 text-[9px] uppercase tracking-[0.24em] text-white/28 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-4">
                <span>Mode: NEURAL_REASONING</span>
                <span>Token_Est: 244/8192</span>
              </div>
              <span className="text-mahi-accent/60">READY_FOR_INPUT</span>
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

export default function ChatPage() {
  const [mode, setMode] = useState("empty");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(sampleMessages);
  const [streaming, setStreaming] = useState(false);

  const placeholderAssistant = useMemo(
    () => ({
      role: "assistant",
      type: "analysis",
      label: "Generating_Response...",
      content:
        "Understood. I am synthesizing a structured response and preparing the next phase of the neural output.",
      code: `[STREAM_STATE]
> STATUS: ACTIVE
> MODEL: MAHI_ULTRA_v4
> CONTEXT_WINDOW: 128K
> PIPELINE: RESPONSE_SYNTHESIS`,
    }),
    []
  );

  function startThread() {
    if (!input.trim()) return;
    setMode("thread");
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        type: "text",
        content: input.trim(),
        meta: "Now",
      },
      placeholderAssistant,
    ]);
    setInput("");
    setStreaming(true);

    window.setTimeout(() => {
      setStreaming(false);
    }, 2200);
  }

  function sendInThread() {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      type: "text",
      content: input.trim(),
      meta: "Now",
    };

    setMessages((prev) => [...prev, userMessage, placeholderAssistant]);
    setInput("");
    setStreaming(true);

    window.setTimeout(() => {
      setStreaming(false);
    }, 2200);
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
        <EmptyState input={input} setInput={setInput} startThread={startThread} />
      ) : (
        <ActiveThread
          input={input}
          setInput={setInput}
          onSend={sendInThread}
          messages={messages}
          streaming={streaming}
        />
      )}
    </div>
  );
}