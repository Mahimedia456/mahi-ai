import { userActivityFeed } from "../data/usersData";

export default function UserActivityPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#53f5e7]/80">
          User Management
        </p>
        <h1
          className="mt-3 text-[34px] font-extrabold tracking-[-0.04em] text-white"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
        >
          User Activity
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9eaaa7]">
          Review subscription updates, moderation actions, and generation behavior.
        </p>
      </section>

      <div className="space-y-4">
        {userActivityFeed.map((item) => (
          <div
            key={item.id}
            className="rounded-[24px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-5 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3
                  className="text-[18px] font-bold tracking-[-0.02em] text-white"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                >
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#9ba8a5]">{item.description}</p>
              </div>

              <span className="rounded-full bg-[#53f5e7]/10 px-3 py-1 text-[11px] font-semibold text-[#53f5e7]">
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}