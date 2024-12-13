"use client";
import { useState, useEffect } from "react";
import { CreateApiKeyModal } from "./components/CreateApiKeyModal";
import { CurrentPlan } from "./components/CurrentPlan";
import { ApiKeysTable } from "./components/ApiKeysTable";
import { useApiKeys } from "@/hooks/useApiKeys";

export default function Dashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    apiKeys,
    isLoading,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  } = useApiKeys();

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const handleCreateApiKey = async (name: string) => {
    const success = await createApiKey(name);
    if (success) {
      setIsCreateModalOpen(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {/* 顶部导航 */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Pages</span>
              <span>/</span>
              <span>Overview</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Operational</span>
              </div>
            </div>
          </div>

          <CurrentPlan />

          {/* API Keys 部分 */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">API Keys</h2>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  New API Key
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                The key is used to authenticate your requests to the Research
                API. To learn more, see the documentation page.
              </p>
            </div>

            <ApiKeysTable
              apiKeys={apiKeys}
              onUpdateKey={updateApiKey}
              onDeleteKey={deleteApiKey}
            />
          </div>
        </>
      )}

      <CreateApiKeyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateApiKey}
      />
    </div>
  );
}
