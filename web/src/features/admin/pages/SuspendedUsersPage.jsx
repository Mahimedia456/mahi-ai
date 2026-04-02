import UsersTable from "../components/users/UsersTable";
import { users } from "../data/usersData";

export default function SuspendedUsersPage() {
  const suspended = users.filter((u) => u.status === "suspended");

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
          Suspended Users
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9eaaa7]">
          Review restricted accounts, moderation hits, and suspended user records.
        </p>
      </section>

      <UsersTable data={suspended} />
    </div>
  );
}