import StorageStatCard from "../components/storage/StorageStatCard";
import UserStorageTable from "../components/storage/UserStorageTable";
import { storageSummary, userStorageRecords } from "../data/storageData";

export default function StorageUsagePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#53f5e7]/80">
          Storage Management
        </p>
        <h1
          className="mt-3 text-[34px] font-extrabold tracking-[-0.04em] text-white"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
        >
          Storage Usage
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9eaaa7]">
          Monitor platform storage consumption, distribution by media type, and high-usage accounts.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StorageStatCard
          title="Total Used"
          value={storageSummary.totalUsed}
          hint={`of ${storageSummary.totalCapacity} total capacity`}
        />
        <StorageStatCard
          title="Utilization"
          value={`${storageSummary.utilization}%`}
          hint={`Monthly growth ${storageSummary.monthlyGrowth}`}
        />
        <StorageStatCard
          title="Images"
          value={storageSummary.imageStorage}
          hint="Generated image assets"
        />
        <StorageStatCard
          title="Videos"
          value={storageSummary.videoStorage}
          hint="Rendered video outputs"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-6 backdrop-blur-xl">
          <h3
            className="text-[20px] font-bold tracking-[-0.03em] text-white"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            Capacity Distribution
          </h3>
          <p className="mt-2 text-sm text-[#93a19e]">
            Current storage distribution by content category.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-[#a2afac]">Images</span>
                <span className="text-white">{storageSummary.imageStorage}</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-[#252525]">
                <div className="h-full w-[40%] rounded-full bg-[#53f5e7]" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-[#a2afac]">Videos</span>
                <span className="text-white">{storageSummary.videoStorage}</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-[#252525]">
                <div className="h-full w-[55%] rounded-full bg-[#53f5e7]" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-[#a2afac]">Archived Media</span>
                <span className="text-white">{storageSummary.archivedStorage}</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-[#252525]">
                <div className="h-full w-[12%] rounded-full bg-[#53f5e7]" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-6 backdrop-blur-xl">
          <h3
            className="text-[20px] font-bold tracking-[-0.03em] text-white"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            Storage Snapshot
          </h3>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-white/5 bg-[#151515] p-4">
              <p className="text-sm text-[#98a5a2]">Active Buckets</p>
              <p className="mt-2 text-2xl font-bold text-white">{storageSummary.activeBuckets}</p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#151515] p-4">
              <p className="text-sm text-[#98a5a2]">Archived Storage</p>
              <p className="mt-2 text-2xl font-bold text-white">{storageSummary.archivedStorage}</p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#151515] p-4">
              <p className="text-sm text-[#98a5a2]">Growth Rate</p>
              <p className="mt-2 text-2xl font-bold text-white">{storageSummary.monthlyGrowth}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h3
            className="text-[22px] font-bold tracking-[-0.03em] text-white"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            User Storage
          </h3>
          <p className="mt-2 text-sm text-[#93a19e]">
            Highest storage consumers across user accounts.
          </p>
        </div>

        <UserStorageTable data={userStorageRecords} />
      </section>
    </div>
  );
}