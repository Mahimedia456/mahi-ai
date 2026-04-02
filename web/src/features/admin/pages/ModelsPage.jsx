import ModelStatCard from "../components/models/ModelStatCard";
import ModelsTable from "../components/models/ModelsTable";
import { models } from "../data/modelsData";

export default function ModelsPage() {
  const activeModels = models.filter((item) => item.status === "active").length;
  const disabledModels = models.filter((item) => item.status === "disabled").length;

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#53f5e7]/80">
          Model Management
        </p>
        <h1
          className="mt-3 text-[34px] font-extrabold tracking-[-0.04em] text-white"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
        >
          Model List
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9eaaa7]">
          Manage deployed AI models, runtime capacity, performance behavior, and operational availability.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <ModelStatCard title="Total Models" value={models.length} hint="Registered internal models" />
        <ModelStatCard title="Active" value={activeModels} hint="Currently serving traffic" />
        <ModelStatCard title="Disabled" value={disabledModels} hint="Held back from production" />
        <ModelStatCard title="Primary Stack" value="Image + Video" hint="Highest production demand" />
      </section>

      <ModelsTable data={models} />
    </div>
  );
}