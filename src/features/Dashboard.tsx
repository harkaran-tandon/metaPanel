import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { BuilderConfig } from "../types";
import { AnimatePresence, motion } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();
  const [recentPages, setRecentPages] = useState<BuilderConfig[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPageName, setNewPageName] = useState("");

  const handleCreatePage = () => {
    if (!newPageName.trim()) return;

    const id = uuidv4();
    const config: BuilderConfig = {
      id,
      name: newPageName.trim(),
      components: [],
      createdAt: new Date().toISOString(),
      grid: { rows: 12, columns: 4 },
    };

    localStorage.setItem(`builder-config-${id}`, JSON.stringify(config));
    navigate(`/builder/${id}`);
  };

  useEffect(() => {
    const configs: BuilderConfig[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("builder-config-")) {
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const config = JSON.parse(raw);
            configs.push(config);
          } catch {
            // Ignore invalid JSON
          }
        }
      }
    }

    configs.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setRecentPages(configs);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Welcome to the SaaS Dashboard Builder 👋</h2>
        <p className="text-gray-600 mt-2">
          Start building internal tools by creating a new page or connecting to an API.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          + New Page
        </button>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Recent Pages</h3>
        {recentPages.length === 0 ? (
          <p className="text-gray-500">No pages created yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentPages.map((page) => (
              <div
                key={page.id}
                className="p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/builder/${page.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(`/builder/${page.id}`);
                  }
                }}
              >
                <h4
                  className="font-semibold text-indigo-700 mb-2 truncate"
                  title={page.name}
                >
                  {page.name}
                </h4>
                <p className="text-sm text-gray-500">
                  Created: {new Date(page.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal with framer-motion animation */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Translucent backdrop */}
            <motion.div
              className="fixed inset-0 bg-opacity-20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            {/* Modal content */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 z-50">
                <h3 className="text-lg font-semibold mb-4">Name your new page</h3>
                <input
                  type="text"
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  placeholder="Enter page name"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setNewPageName("");
                    }}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!newPageName.trim()) return;
                      handleCreatePage();
                      setNewPageName("");
                      setIsModalOpen(false);
                    }}
                    className={`px-4 py-2 rounded text-white ${
                      newPageName.trim()
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-indigo-300 cursor-not-allowed"
                    }`}
                    disabled={!newPageName.trim()}
                  >
                    Create
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
