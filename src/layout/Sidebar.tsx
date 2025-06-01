import {
  HomeIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: HomeIcon, roles: ["admin", "editor"] },
  { label: "Form Builder", path: "/form-builder", icon: WrenchScrewdriverIcon, roles: ["admin", "editor"] },
];

export default function Sidebar() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role as string;

  return (
    <aside className="w-64 bg-gray-900 text-white h-full p-4">
      <div className="text-xl font-bold mb-6">🧱 Tool Builder</div>
      <nav className="space-y-2">
        {navItems
          .filter(item => item.roles.includes(role))
          .map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded hover:bg-gray-700 ${
                  isActive ? "bg-gray-800 font-semibold" : ""
                }`
              }
              end
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          ))}
      </nav>
    </aside>
  );
}
