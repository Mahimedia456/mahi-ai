import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../../api/adminApi";

export default function UserFormPage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const isEdit = Boolean(userId);

  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
    dateOfBirth: "",
    country: "",
    notes: "",
    planSlug: "starter"
  });

  useEffect(() => {
    async function load() {
      try {
        const plansRes = await adminApi.getPlans();
        setPlans(plansRes.data.data.plans || []);

        if (isEdit) {
          const userRes = await adminApi.getUserById(userId);
          const user = userRes.data.data.user;
          const subscription = userRes.data.data.subscription;

          setForm((prev) => ({
            ...prev,
            fullName: user.name || "",
            email: user.email || "",
            role: user.role || "user",
            status: user.status || "active",
            dateOfBirth: user.date_of_birth || "",
            country: user.country || "",
            notes: user.notes || "",
            planSlug: subscription?.plan_slug || "starter"
          }));
        }
      } catch (error) {
        console.error(error);
      }
    }

    load();
  }, [isEdit, userId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (isEdit) {
        await adminApi.updateUser(userId, form);
      } else {
        await adminApi.createUser(form);
      }
      navigate("/admin/users");
    } catch (error) {
      alert(error?.response?.data?.message || "Save failed");
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <h1
          className="text-[34px] font-extrabold tracking-[-0.04em] text-white"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
        >
          {isEdit ? "Edit User" : "Add New User"}
        </h1>
      </section>

      <form
        onSubmit={handleSubmit}
        className="rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-6 backdrop-blur-xl"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="theme-input" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="theme-input" required disabled={isEdit} />
          {!isEdit && (
            <input name="password" value={form.password} onChange={handleChange} placeholder="Password" className="theme-input" required />
          )}
          <select name="role" value={form.role} onChange={handleChange} className="theme-input">
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
          <select name="status" value={form.status} onChange={handleChange} className="theme-input">
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
          <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className="theme-input" />
          <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="theme-input" />
          <select name="planSlug" value={form.planSlug} onChange={handleChange} className="theme-input">
            {plans.map((plan) => (
              <option key={plan.id} value={plan.slug}>
                {plan.name}
              </option>
            ))}
          </select>
        </div>

        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Admin notes"
          className="theme-input mt-5 min-h-[130px]"
        />

        <div className="mt-5 flex gap-3">
          <button type="submit" className="theme-btn-primary px-6 py-3">
            {isEdit ? "Update User" : "Create User"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}