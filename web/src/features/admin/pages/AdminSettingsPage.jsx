import { useState } from "react";

import SettingsTabs from "../components/settings/SettingsTabs";

import GeneralSettings from "./settings/GeneralSettings";
import EmailSettings from "./settings/EmailSettings";
import AiLimitsSettings from "./settings/AiLimitsSettings";
import ModerationSettings from "./settings/ModerationSettings";
import BlockedWordsSettings from "./settings/BlockedWordsSettings";
import AdminUsersSettings from "./settings/AdminUsersSettings";
import RolesSettings from "./settings/RolesSettings";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/70 p-7 backdrop-blur-xl">
        <p className="text-[12px] uppercase tracking-[0.25em] text-[#53f5e7]/80">
          System Configuration
        </p>

        <h1
          className="mt-3 text-[34px] font-extrabold text-white"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
        >
          Platform Settings
        </h1>

        <p className="mt-3 text-sm text-[#97a3a0] max-w-xl">
          Configure platform behavior, moderation policies, AI limits,
          notification rules, and administrative roles.
        </p>
      </section>

      <SettingsTabs active={activeTab} setActive={setActiveTab} />

      {activeTab === "general" && <GeneralSettings />}
      {activeTab === "email" && <EmailSettings />}
      {activeTab === "ai" && <AiLimitsSettings />}
      {activeTab === "moderation" && <ModerationSettings />}
      {activeTab === "blocked" && <BlockedWordsSettings />}
      {activeTab === "admins" && <AdminUsersSettings />}
      {activeTab === "roles" && <RolesSettings />}
    </div>
  );
}