import { UserButton } from "@clerk/clerk-react";

export default function Topbar() {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-4">
      <div className="text-xl font-bold mb-6">🧱 Tool Builder</div>
      <div className="flex items-center gap-4">
        {/* Future: Theme toggle, notifications */}
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
