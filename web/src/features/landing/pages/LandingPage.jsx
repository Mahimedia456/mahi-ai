import { Link } from "react-router-dom";

const features = [
  {
    title: "AI Chat Assistant",
    desc: "Sophisticated reasoning and creative writing with context-aware responses.",
    icon: "✦",
  },
  {
    title: "Image Generation",
    desc: "Convert text prompts into photorealistic masterpieces in seconds.",
    icon: "🖼",
  },
  {
    title: "Image Editing",
    desc: "Advanced in-painting and out-painting tools for pixel-perfect modifications.",
    icon: "✎",
  },
  {
    title: "Video Generation",
    desc: "Bring your concepts to life with fluid, high-resolution cinematic video.",
    icon: "▶",
  },
];

const workflow = [
  {
    step: "1",
    title: "Write a Prompt",
    desc: "Describe your vision using natural language. Our system understands nuance and artistic styles.",
  },
  {
    step: "2",
    title: "Generate AI Output",
    desc: "Watch as our neural engines render your request in real-time with stunning accuracy.",
  },
  {
    step: "3",
    title: "Download or Edit",
    desc: "Finalize your creation by downloading in high res or tweaking it further in our studio.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    suffix: "/mo",
    button: "Get Started",
    highlighted: false,
    features: [
      "10 Free AI Generations / Day",
      "Standard Chat Access",
      "Community Support",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    suffix: "/mo",
    button: "Go Pro Now",
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Unlimited Generations",
      "Priority GPU Access",
      "4K Video Export",
      "Private Workspaces",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    suffix: "",
    button: "Contact Sales",
    highlighted: false,
    features: [
      "Dedicated GPU Cluster",
      "Custom Model Training",
      "24/7 Priority Support",
    ],
  },
];

const trustItems = [
  {
    icon: "🛡",
    title: "Secure platform",
    desc: "Enterprise-grade encryption for all your data and generated assets.",
  },
  {
    icon: "🔒",
    title: "Private workspaces",
    desc: "Your ideas and creations are your own. We never train models on your private data.",
  },
  {
    icon: "⚡",
    title: "High performance AI infrastructure",
    desc: "Powered by the latest GPU clusters for near-instant generation.",
  },
];

export default function LandingPage() {
  return (
    <div className="landing-page min-h-screen overflow-x-hidden">
      <header className="landing-nav">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div
            className="text-2xl font-black tracking-tight text-white"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            Mahi AI
          </div>

          <nav
            className="hidden items-center gap-8 text-sm font-bold md:flex"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            <a href="#home" className="border-b-2 border-mahi-accent pb-1 text-mahi-accent">
              Home
            </a>
            <a href="#features" className="theme-link text-mahi-textMuted">
              Features
            </a>
            <a href="#pricing" className="theme-link text-mahi-textMuted">
              Pricing
            </a>
            <a href="#support" className="theme-link text-mahi-textMuted">
              Support
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-bold text-mahi-textMuted transition-colors hover:text-white"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              Login
            </Link>
            <Link to="/register" className="theme-btn-primary px-5 py-2.5 text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24">
        <section
          id="home"
          className="relative mx-auto flex min-h-[920px] max-w-7xl items-center px-6 lg:px-8"
        >
          <div className="pointer-events-none absolute -left-20 top-1/4 h-[500px] w-[500px] rounded-full bg-mahi-accent/10 blur-[120px]" />

          <div className="relative z-10 grid w-full items-center gap-12 md:grid-cols-2">
            <div className="space-y-8">
              <div className="theme-pill">
                <span className="h-2 w-2 animate-pulse rounded-full bg-mahi-accent" />
                <span
                  className="text-xs font-bold uppercase tracking-[0.25em] text-mahi-textMuted"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                >
                  Next-Gen Intelligence
                </span>
              </div>

              <div>
                <h1 className="theme-heading text-4xl font-black leading-[1.05] sm:text-6xl lg:text-7xl">
                  Create Images,
                  <br />
                  Videos and Ideas
                  <br />
                  <span className="text-mahi-accent">with AI</span>
                </h1>

                <p className="mt-6 max-w-xl text-lg leading-relaxed text-mahi-textMuted">
                  Mahi AI Assistant helps you generate images, edit visuals,
                  create videos and chat with AI from a single powerful
                  workspace.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/register" className="theme-btn-primary px-8 py-4 text-lg">
                  Start Creating
                </Link>
                <button className="theme-btn-secondary px-8 py-4 text-lg">
                  View Demo
                </button>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 rounded-3xl bg-mahi-accent/20 blur-3xl transition-all duration-700 group-hover:bg-mahi-accent/30" />
              <div className="theme-glass-panel theme-neon-border-top relative overflow-hidden rounded-3xl p-4 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80"
                  alt="AI hero"
                  className="h-[500px] w-full rounded-2xl object-cover opacity-90"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="theme-heading text-4xl font-extrabold">What You Can Create</h2>
            <p className="text-mahi-textMuted">
              Unlimited possibilities powered by specialized models
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((item) => (
              <div key={item.title} className="landing-card rounded-xl p-8">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-mahi-surfaceHigh">
                  <span className="text-xl text-mahi-accent">{item.icon}</span>
                </div>
                <h3
                  className="mb-3 text-xl font-bold text-white"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-mahi-textMuted">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-mahi-surfaceLowest py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2 lg:px-8">
            <div>
              <h2 className="theme-heading mb-12 text-4xl font-extrabold">
                How Mahi AI Works
              </h2>

              <div className="space-y-12">
                {workflow.map((item) => (
                  <div key={item.step} className="flex gap-6">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mahi-accent font-bold text-mahi-accentText"
                      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                    >
                      {item.step}
                    </div>
                    <div>
                      <h4
                        className="mb-2 text-xl font-bold text-white"
                        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                      >
                        {item.title}
                      </h4>
                      <p className="text-mahi-textMuted">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-mahi-accent/5 blur-[80px]" />
              <img
                src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1200&q=80"
                alt="Workflow"
                className="relative z-10 rounded-2xl border border-mahi-outlineVariant/30 shadow-2xl"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <h2 className="theme-heading mb-16 text-center text-4xl font-extrabold">
            Engineered for Creators
          </h2>

          <div className="grid grid-cols-12 gap-6 lg:h-[700px]">
            <div className="landing-bento col-span-12 md:col-span-8">
              <div
                className="absolute z-10 m-6 rounded-full bg-mahi-bg/50 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-mahi-accent backdrop-blur-md"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                Chat Interface
              </div>
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
                alt="Chat interface"
                className="h-full w-full object-cover opacity-60"
              />
            </div>

            <div className="landing-bento col-span-12 md:col-span-4">
              <div
                className="absolute z-10 m-6 rounded-full bg-mahi-bg/50 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-mahi-accent backdrop-blur-md"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                Image Studio
              </div>
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
                alt="Image studio"
                className="h-full w-full object-cover opacity-60"
              />
            </div>

            <div className="landing-bento col-span-12 md:col-span-4">
              <div
                className="absolute z-10 m-6 rounded-full bg-mahi-bg/50 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-mahi-accent backdrop-blur-md"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                Video Engine
              </div>
              <img
                src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80"
                alt="Video engine"
                className="h-full w-full object-cover opacity-60"
              />
            </div>

            <div className="landing-bento col-span-12 md:col-span-8">
              <div className="flex h-full flex-col justify-center p-12">
                <h4
                  className="mb-6 text-3xl font-black text-white"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                >
                  Unified Workspace
                </h4>
                <p className="max-w-md text-lg text-mahi-textMuted">
                  Switch between chat, images, and video without ever losing
                  your context. Mahi keeps your creative flow uninterrupted.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <div
                    className="rounded-lg border border-mahi-outlineVariant/20 bg-mahi-surfaceHigh px-4 py-2 text-xs font-bold text-mahi-accent"
                    style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  >
                    REAL-TIME SYNC
                  </div>
                  <div
                    className="rounded-lg border border-mahi-outlineVariant/20 bg-mahi-surfaceHigh px-4 py-2 text-xs font-bold text-mahi-accent"
                    style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  >
                    CLOUD RENDER
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-mahi-surface py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="theme-heading mb-4 text-4xl font-extrabold">
                Simple Pricing
              </h2>
              <p className="text-mahi-textMuted">
                Choose the plan that fits your creative scale
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={
                    plan.highlighted
                      ? "theme-glass-panel relative flex scale-105 flex-col rounded-2xl border border-mahi-accent/30 p-10 shadow-[0_0_50px_rgba(83,245,231,0.1)]"
                      : "flex flex-col rounded-2xl border border-mahi-outlineVariant/10 bg-mahi-surfaceContainer p-10"
                  }
                >
                  {plan.badge && (
                    <div
                      className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-mahi-accent px-4 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-mahi-accentText"
                      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <div className="mb-8">
                    <h3
                      className="mb-2 text-xl font-bold text-white"
                      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                    >
                      {plan.name}
                    </h3>
                    <div
                      className="text-4xl font-black text-white"
                      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                    >
                      {plan.price}
                      {plan.suffix ? (
                        <span className="text-sm font-normal text-mahi-textMuted">
                          {plan.suffix}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <ul className="mb-10 flex-grow space-y-4">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className={`flex items-center gap-3 text-sm ${
                          plan.highlighted ? "font-medium text-white" : "text-mahi-textMuted"
                        }`}
                      >
                        <span className="text-mahi-accent">●</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={
                      plan.highlighted
                        ? "theme-btn-primary w-full justify-center py-4"
                        : "w-full rounded-full border border-mahi-outlineVariant py-3 font-bold text-white transition-all hover:bg-mahi-surfaceHigh"
                    }
                    style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  >
                    {plan.button}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-mahi-outlineVariant/10 py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 text-center md:grid-cols-3 lg:px-8">
            {trustItems.map((item) => (
              <div key={item.title} className="space-y-4">
                <div className="text-4xl text-mahi-accent">{item.icon}</div>
                <h5
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                >
                  {item.title}
                </h5>
                <p className="text-sm text-mahi-textMuted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden px-6 py-32 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-mahi-accent/5" />
          <div className="relative z-10 mx-auto max-w-4xl space-y-10 text-center">
            <h2 className="theme-heading text-4xl font-black md:text-6xl">
              Start Creating With AI Today
            </h2>

            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-mahi-textMuted">
              Join creators who are redefining what’s possible with Mahi AI
              Assistant. No credit card required to start.
            </p>

            <div className="flex flex-col justify-center gap-6 sm:flex-row">
              <Link to="/register" className="theme-btn-primary px-10 py-5 text-xl">
                Get Started for Free
              </Link>
              <button className="theme-btn-secondary px-10 py-5 text-xl">
                Schedule Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-mahi-outlineVariant/10 bg-mahi-surfaceLowest px-6 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-4">
          <div className="space-y-6">
            <div
              className="text-2xl font-black tracking-tight text-white"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              Mahi AI
            </div>
            <p className="text-sm leading-relaxed text-mahi-textMuted">
              Pushing the boundaries of human-AI collaboration through elegant
              design and powerful models.
            </p>

            <div className="flex gap-4">
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-mahi-outlineVariant/20 bg-mahi-surfaceContainer text-mahi-textMuted transition-colors hover:text-mahi-accent">
                ↗
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-mahi-outlineVariant/20 bg-mahi-surfaceContainer text-mahi-textMuted transition-colors hover:text-mahi-accent">
                ◎
              </button>
            </div>
          </div>

          <div>
            <h6
              className="mb-6 font-bold text-white"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              Product
            </h6>
            <ul className="space-y-4 text-sm text-mahi-textMuted">
              <li><a href="#" className="theme-link">AI Chat</a></li>
              <li><a href="#" className="theme-link">Image Gen</a></li>
              <li><a href="#" className="theme-link">Video Gen</a></li>
              <li><a href="#" className="theme-link">Enterprise</a></li>
            </ul>
          </div>

          <div>
            <h6
              className="mb-6 font-bold text-white"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              Company
            </h6>
            <ul className="space-y-4 text-sm text-mahi-textMuted">
              <li><a href="#" className="theme-link">About Us</a></li>
              <li><a href="#" className="theme-link">Careers</a></li>
              <li><a href="#" className="theme-link">Blog</a></li>
              <li><a href="#" className="theme-link">Privacy</a></li>
            </ul>
          </div>

          <div>
            <h6
              className="mb-6 font-bold text-white"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              Newsletter
            </h6>
            <p className="mb-6 text-sm text-mahi-textMuted">
              Get the latest AI updates delivered weekly.
            </p>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-lg bg-mahi-surfaceContainer px-4 py-2 text-sm text-white outline-none placeholder:text-white/25 focus:ring-1 focus:ring-mahi-accent"
              />
              <button
                className="rounded-lg bg-mahi-accent px-4 py-2 font-bold text-mahi-accentText transition-all hover:scale-105"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-20 max-w-7xl border-t border-mahi-outlineVariant/10 pt-8 text-center text-xs font-medium uppercase tracking-[0.25em] text-mahi-textMuted">
          © 2024 MAHI AI ASSISTANT. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
}