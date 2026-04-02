import ContentStatCard from "../components/content/ContentStatCard";
import ContentTable from "../components/content/ContentTable";
import { videoContent } from "../data/contentData";

export default function ContentVideosPage() {
  const approved = videoContent.filter((item) => item.status === "approved").length;

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#53f5e7]/80">
          Content Management
        </p>
        <h1
          className="mt-3 text-[34px] font-extrabold tracking-[-0.04em] text-white"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
        >
          Generated Videos
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9eaaa7]">
          Track video assets, rendering outputs, model lineage, and usage state.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <ContentStatCard title="Total Videos" value={videoContent.length} hint="All rendered video assets" />
        <ContentStatCard title="Approved" value={approved} hint="Clean approved outputs" />
        <ContentStatCard title="Workspace/Private" value={videoContent.length} hint="Current stored visibility mix" />
      </section>

      <ContentTable data={videoContent} />
    </div>
  );
}