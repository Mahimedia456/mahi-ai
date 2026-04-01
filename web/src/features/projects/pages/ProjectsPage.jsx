import { Link } from "react-router-dom";
import {
  Search,
  Bell,
  Plus,
  FileUp,
  MoreVertical,
  FileText,
  Clock3,
} from "lucide-react";

const tabs = ["All Projects", "Recent", "Shared"];

const projects = [
  {
    id: "winter-campaign-2024",
    title: "Winter Campaign 2024",
    assets: 24,
    time: "2h ago",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "brand-evolution-v2",
    title: "Brand Evolution v2",
    assets: 8,
    time: "5h ago",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "neural-interface-ui",
    title: "Neural Interface UI",
    assets: 42,
    time: "Yesterday",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "obsidian-product",
    title: "Obsidian Product",
    assets: 16,
    time: "2d ago",
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "synthetic-data",
    title: "Synthetic Data",
    assets: 102,
    time: "3d ago",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
  },
];

function TopTab({ label, active }) {
  return (
    <button
      className={`pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
        active
          ? "border-b-2 border-mahi-accent text-mahi-accent"
          : "text-white/35 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function FeaturedProjectCard({ project }) {
  return (
    <Link
      to={`/app/projects/${project.id}`}
      className="group relative col-span-1 overflow-hidden border border-mahi-accent/20 transition-all duration-500 hover:border-mahi-accent/60 md:col-span-2"
    >
      <div className="relative h-72 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover grayscale opacity-40 transition-all duration-1000 group-hover:scale-105 group-hover:opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-mahi-accent shadow-[0_0_8px_#53f5e7]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-mahi-accent">
                Priority Active
              </span>
            </div>

            <h3 className="theme-heading text-5xl font-bold uppercase tracking-tight text-white">
              {project.title}
            </h3>

            <div className="mt-4 flex items-center gap-6">
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/45">
                <FileText size={13} className="text-mahi-accent" />
                {project.assets} Assets
              </span>
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/45">
                <Clock3 size={13} className="text-mahi-accent" />
                {project.time}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="flex h-12 w-12 items-center justify-center border border-mahi-accent/30 text-white transition-all hover:bg-mahi-accent hover:text-black"
          >
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
    </Link>
  );
}

function ProjectCard({ project }) {
  return (
    <Link
      to={`/app/projects/${project.id}`}
      className="group flex flex-col border border-mahi-accent/10 transition-all duration-300 hover:border-mahi-accent/50"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover grayscale opacity-30 transition-all duration-1000 group-hover:scale-110 group-hover:opacity-50"
        />
      </div>

      <div className="flex flex-1 flex-col p-8">
        <div className="mb-6 flex items-start justify-between">
          <h3 className="theme-heading text-2xl font-bold uppercase tracking-[0.06em] text-white">
            {project.title}
          </h3>
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="text-white/20 transition-colors hover:text-mahi-accent"
          >
            <MoreVertical size={18} />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-mahi-accent/10 pt-6">
          <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-mahi-accent">
            {project.assets} Assets
          </span>
          <span className="text-[8px] uppercase tracking-[0.3em] text-white/35">
            {project.time}
          </span>
        </div>
      </div>
    </Link>
  );
}

function NewProjectCard() {
  return (
    <button className="flex min-h-[280px] flex-col items-center justify-center border border-dashed border-mahi-accent/30 p-8 transition-all duration-500 hover:border-mahi-accent hover:bg-mahi-accent/5">
      <div className="mb-6 flex h-16 w-16 items-center justify-center border border-mahi-accent/40 text-mahi-accent transition-all hover:scale-110">
        <Plus size={30} />
      </div>
      <span className="text-[11px] font-bold uppercase tracking-[0.38em] text-white/35 transition-colors hover:text-mahi-accent">
        Initialize_Project
      </span>
    </button>
  );
}

export default function ProjectsPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-black">
      <header className="sticky top-16 z-20 flex items-center justify-between border-b border-mahi-accent/20 bg-black px-10 py-5">
        <div className="flex items-center gap-12">
          <h2 className="theme-heading text-3xl font-bold uppercase tracking-[0.22em] text-white">
            Projects
          </h2>

          <div className="relative flex items-center">
            <Search size={14} className="absolute left-0 text-mahi-accent" />
            <input
              type="text"
              placeholder="SEARCH_FILES..."
              className="w-64 border-none bg-transparent py-1.5 pl-8 pr-4 text-[11px] uppercase tracking-[0.16em] text-white placeholder:text-white/20 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="border border-mahi-accent/30 px-6 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-white transition-all hover:border-mahi-accent hover:text-mahi-accent">
            Import Asset
          </button>
          <button className="bg-mahi-accent px-6 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-black shadow-[0_0_15px_rgba(83,245,231,0.4)]">
            New Project
          </button>
          <div className="mx-2 h-6 w-px bg-mahi-accent/20" />
          <button className="text-white/35 transition-colors hover:text-mahi-accent">
            <Bell size={18} />
          </button>
        </div>
      </header>

      <div className="p-10">
        <div className="mb-16 flex items-end justify-between">
          <div className="flex max-w-md gap-12 border-b border-mahi-accent/10 pb-0">
            {tabs.map((tab, index) => (
              <TopTab key={tab} label={tab} active={index === 0} />
            ))}
          </div>

          <div className="text-right">
            <div className="theme-heading text-6xl font-bold tracking-tight text-white">
              12{" "}
              <span className="ml-2 text-[10px] font-medium uppercase tracking-[0.3em] text-mahi-accent">
                Files
              </span>
            </div>
            <div className="relative mt-3 h-px w-48 overflow-hidden bg-mahi-accent/10">
              <div className="absolute inset-y-0 left-0 w-[40%] bg-mahi-accent shadow-[0_0_8px_rgba(83,245,231,0.4)]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <FeaturedProjectCard project={projects[0]} />
          <ProjectCard project={projects[1]} />
          <ProjectCard project={projects[2]} />
          <ProjectCard project={projects[3]} />
          <ProjectCard project={projects[4]} />
          <NewProjectCard />
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-0 right-0 p-10">
        <div className="flex items-center gap-6 border border-mahi-accent/20 bg-black px-6 py-3">
          <div className="h-2 w-2 animate-pulse rounded-full bg-mahi-accent shadow-[0_0_8px_#53f5e7]" />
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white">
            AI_SYNAPSE_LINK_STABLE
          </span>
          <div className="relative h-px w-32 overflow-hidden bg-mahi-accent/10">
            <div className="h-full w-2/3 bg-mahi-accent shadow-[0_0_8px_rgba(83,245,231,0.4)]" />
          </div>
        </div>
      </div>
    </div>
  );
}