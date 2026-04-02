import ContentStatCard from "../components/content/ContentStatCard";
import ContentTable from "../components/content/ContentTable";
import { imageContent } from "../data/contentData";

export default function ContentImagesPage() {
  const approved = imageContent.filter((item) => item.status === "approved").length;
  const reported = imageContent.filter((item) => item.status === "reported").length;

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
          Generated Images
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9eaaa7]">
          Review image outputs, inspect prompt lineage, and manage content state across the platform.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <ContentStatCard title="Total Images" value={imageContent.length} hint="All generated image assets" />
        <ContentStatCard title="Approved" value={approved} hint="Safe visible outputs" />
        <ContentStatCard title="Reported" value={reported} hint="Needs admin review" />
        <ContentStatCard title="Deleted" value={imageContent.filter((i) => i.status === "deleted").length} hint="Removed assets" />
      </section>

      <ContentTable data={imageContent} />
    </div>
  );
}