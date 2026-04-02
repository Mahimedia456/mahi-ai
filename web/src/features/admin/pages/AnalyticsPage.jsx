import { useMemo, useState } from "react";
import AnalyticsTabs from "../components/analytics/AnalyticsTabs.jsx";
import AnalyticsStatCard from "../components/analytics/AnalyticsStatCard.jsx";
import {
  activeUsersStats,
  imageStats,
  platformChart,
  platformStats,
  revenueChart,
  revenueStats,
  videoStats,
} from "../data/analyticsData.js";
function ChartCard({ title, subtitle, bars, labelsKey = "day" }) {
  const max = useMemo(() => Math.max(...bars.map((item) => item.value)), [bars]);

  return (
    <div className="rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
      <h3
        className="text-[22px] font-bold tracking-[-0.03em] text-white"
        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
      >
        {title}
      </h3>
      <p className="mt-2 text-sm text-[#93a19e]">{subtitle}</p>

      <div className="relative mt-8 flex h-64 items-end gap-3">
        {bars.map((item, index) => (
          <div key={index} className="flex flex-1 flex-col items-center justify-end gap-3">
            <div
              className="w-full rounded-t-[12px] bg-[#53f5e7]/20"
              style={{ height: `${(item.value / max) * 100}%` }}
            >
              <div className="h-full w-full rounded-t-[12px] bg-[#53f5e7]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#73807d]">
              {item[labelsKey]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("platform");

  let stats = platformStats;
  let title = "Platform Analytics";
  let subtitle = "System-wide product and engagement metrics.";
  let chartTitle = "Weekly Platform Activity";
  let chartSubtitle = "Aggregated system performance over the last 7 days.";
  let chartBars = platformChart;
  let labelsKey = "day";

  if (activeTab === "images") {
    stats = imageStats;
    title = "Image Generation Stats";
    subtitle = "Image generation throughput, success, and speed metrics.";
    chartTitle = "Weekly Image Generation";
    chartSubtitle = "Image activity trend for the last 7 days.";
    chartBars = platformChart;
  }

  if (activeTab === "videos") {
    stats = videoStats;
    title = "Video Generation Stats";
    subtitle = "Video rendering throughput and output performance.";
    chartTitle = "Weekly Video Rendering";
    chartSubtitle = "Video rendering demand trend.";
    chartBars = platformChart;
  }

  if (activeTab === "revenue") {
    stats = revenueStats;
    title = "Revenue Analytics";
    subtitle = "Commercial performance, paid growth, and billing overview.";
    chartTitle = "Revenue Growth";
    chartSubtitle = "Monthly revenue progression.";
    chartBars = revenueChart;
    labelsKey = "month";
  }

  if (activeTab === "active-users") {
    stats = activeUsersStats;
    title = "Active Users";
    subtitle = "Engagement and retention across daily, weekly, and monthly cohorts.";
    chartTitle = "Active User Trend";
    chartSubtitle = "Weekly active user movement.";
    chartBars = platformChart;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#53f5e7]/80">
          Analytics
        </p>
        <h1
          className="mt-3 text-[34px] font-extrabold tracking-[-0.04em] text-white"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
        >
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9eaaa7]">{subtitle}</p>
      </section>

      <AnalyticsTabs activeTab={activeTab} onChange={setActiveTab} />

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <AnalyticsStatCard
            key={item.label}
            title={item.label}
            value={item.value}
            hint={item.hint}
          />
        ))}
      </section>

      <ChartCard
        title={chartTitle}
        subtitle={chartSubtitle}
        bars={chartBars}
        labelsKey={labelsKey}
      />
    </div>
  );
}