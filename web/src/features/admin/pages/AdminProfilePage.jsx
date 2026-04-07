import { useEffect, useState } from "react";
import { adminApi } from "../../../api/adminApi";

export default function AdminProfilePage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    avatar_url: "",
    role: ""
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await adminApi.getProfile();
        const data = res.data?.data || {};

        setForm({
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          avatar_url: data.avatar_url || "",
          role: data.role || ""
        });
      } catch (error) {
        console.error(error);
      }
    }

    loadProfile();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSave() {
    try {
      await adminApi.updateProfile({
        full_name: form.full_name,
        phone: form.phone,
        avatar_url: form.avatar_url
      });

      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/70 p-7 backdrop-blur-xl">
        <p className="text-[12px] uppercase tracking-[0.25em] text-[#53f5e7]/80">
          Account
        </p>

        <h1
          className="mt-3 text-[34px] font-extrabold text-white"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
        >
          Admin Profile
        </h1>

        <p className="mt-3 max-w-xl text-sm text-[#97a3a0]">
          Manage your profile information and account identity.
        </p>
      </section>

      <div className="rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <div className="grid gap-6 md:grid-cols-2">
          <input
            className="theme-input"
            placeholder="Full name"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
          />

          <input
            className="theme-input"
            placeholder="Email"
            name="email"
            value={form.email}
            disabled
            readOnly
          />

          <input
            className="theme-input"
            placeholder="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            className="theme-input"
            placeholder="Role"
            name="role"
            value={form.role}
            disabled
            readOnly
          />

          <div className="md:col-span-2">
            <input
              className="theme-input"
              placeholder="Avatar URL"
              name="avatar_url"
              value={form.avatar_url}
              onChange={handleChange}
            />
          </div>
        </div>

        <button className="theme-btn-primary mt-6" onClick={handleSave}>
          Save Profile
        </button>
      </div>
    </div>
  );
}