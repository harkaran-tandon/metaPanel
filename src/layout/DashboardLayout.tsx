import Dashboard from "../features/Dashboard";
import Topbar from "./Topbar";

export default function DashboardLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Topbar />
      <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
        <Dashboard />
      </main>
    </div>
  );
}
