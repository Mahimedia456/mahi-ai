import { useEffect, useState } from "react";
import { adminApi } from "../../../../api/adminApi";

export default function AiLimitsSettings() {
  const [form, setForm] = useState({
    images_per_day: "",
    videos_per_day: "",
    tokens_limit: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await adminApi.getAiLimits();
        const data = res.data?.data || {};
        setForm({
          images_per_day: data.images_per_day ?? "",
          videos_per_day: data.videos_per_day ?? "",
          tokens_limit: data.tokens_limit ?? "",
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSave() {
    try {
      await adminApi.updateAiLimits({
        images_per_day: Number(form.images_per_day || 0),
        videos_per_day: Number(form.videos_per_day || 0),
        tokens_limit: Number(form.tokens_limit || 0),
      });
      alert("AI limits updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update AI limits");
    }
  }

  return (
    <div className="rounded-2xl border border-[#53f5e7]/10 bg-[#1b1b1b]/70 p-6">
      <h3 className="text-lg font-bold text-white">AI Usage Limits</h3>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <input
          className="theme-input"
          placeholder="Images per day"
          name="images_per_day"
          value={form.images_per_day}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          className="theme-input"
          placeholder="Videos per day"
          name="videos_per_day"
          value={form.videos_per_day}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          className="theme-input"
          placeholder="Prompt tokens limit"
          name="tokens_limit"
          value={form.tokens_limit}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <button className="theme-btn-primary mt-6" onClick={handleSave}>
        Save Limits
      </button>
    </div>
  );
}