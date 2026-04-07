import { useEffect, useState } from "react";
import { adminApi } from "../../../api/adminApi";

function NotificationBadge({ type }) {
  const map = {
    info: "bg-blue-500/10 text-blue-300",
    warning: "bg-yellow-500/10 text-yellow-300",
    success: "bg-[#53f5e7]/10 text-[#53f5e7]",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${map[type] || "bg-white/10 text-white"}`}>
      {type}
    </span>
  );
}

export default function AdminNotificationsPage() {
  const [items, setItems] = useState([]);

  async function loadData() {
    try {
      const res = await adminApi.getNotifications();
      setItems(res.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleRead(id) {
    try {
      await adminApi.markNotificationRead(id);
      await loadData();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleReadAll() {
    try {
      await adminApi.markAllNotificationsRead();
      await loadData();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/70 p-7 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[12px] uppercase tracking-[0.25em] text-[#53f5e7]/80">
              Admin Center
            </p>

            <h1
              className="mt-3 text-[34px] font-extrabold text-white"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              Notifications
            </h1>

            <p className="mt-3 max-w-xl text-sm text-[#97a3a0]">
              Review system alerts, billing activity, warnings, and platform events.
            </p>
          </div>

          <button className="theme-btn-primary" onClick={handleReadAll}>
            Mark All Read
          </button>
        </div>
      </section>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-[24px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-5 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h3
                    className="text-[18px] font-bold tracking-[-0.02em] text-white"
                    style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  >
                    {item.title}
                  </h3>
                  <NotificationBadge type={item.type} />
                </div>

                <p className="mt-2 text-sm leading-7 text-[#9ba8a5]">
                  {item.description}
                </p>

                <p className="mt-2 text-xs text-[#7f8c89]">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>

              {!item.is_read && (
                <button
                  className="rounded-xl bg-[#53f5e7]/10 px-3 py-2 text-xs font-semibold text-[#53f5e7]"
                  onClick={() => handleRead(item.id)}
                >
                  Mark Read
                </button>
              )}
            </div>
          </div>
        ))}

        {!items.length && (
          <div className="rounded-[24px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-5 text-sm text-[#9ba8a5] backdrop-blur-xl">
            No notifications found.
          </div>
        )}
      </div>
    </div>
  );
}