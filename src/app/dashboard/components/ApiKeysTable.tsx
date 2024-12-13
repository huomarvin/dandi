import { useState } from "react";
import { ApiKey } from "@/hooks/useApiKeys";
import { showToast } from "@/lib/toast";
import { EditApiKeyModal } from "./EditApiKeyModal";

interface ApiKeysTableProps {
  apiKeys: ApiKey[];
  onUpdateKey: (id: string, name: string) => Promise<boolean>;
  onDeleteKey: (id: string) => Promise<boolean>;
}

export function ApiKeysTable({ apiKeys, onUpdateKey, onDeleteKey }: ApiKeysTableProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const handleCopyKey = (key: string) => {
    navigator.clipboard
      .writeText(key)
      .then(() => showToast.success("API key copied"))
      .catch(() => showToast.error("Failed to copy API key"));
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const maskApiKey = (key: string, isVisible: boolean) => {
    if (isVisible) return key;
    return `${key.slice(0, 8)}${"*".repeat(24)}${key.slice(-4)}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 text-sm text-gray-500">
          <tr>
            <th className="text-left py-4 px-6 w-48">NAME</th>
            <th className="text-left py-4 px-6 w-24">USAGE</th>
            <th className="text-left py-4 px-6 w-[420px]">KEY</th>
            <th className="text-right py-4 px-6 w-32">OPTIONS</th>
          </tr>
        </thead>
        <tbody>
          {apiKeys.map((key) => (
            <tr key={key.id} className="border-t">
              <td className="py-4 px-6 w-48">
                {key.name}
              </td>
              <td className="py-4 px-6 w-24">{key.usage}</td>
              <td className="py-4 px-6 w-[420px]">
                <div className="flex items-center gap-2">
                  <code className="font-mono text-sm block w-[360px]">
                    {maskApiKey(key.key, visibleKeys.has(key.id))}
                  </code>
                  <button
                    onClick={() => handleCopyKey(key.key)}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                    title="Copy to clipboard"
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
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </td>
              <td className="py-4 px-6 w-32">
                <div className="flex justify-end gap-2">
                  {/* 显示/隐藏按钮 */}
                  <button
                    onClick={() => toggleKeyVisibility(key.id)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title={visibleKeys.has(key.id) ? "Hide key" : "Show key"}
                  >
                    {visibleKeys.has(key.id) ? (
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
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>

                  {/* 编辑按钮 */}
                  <button
                    onClick={() => {
                      setEditingKey(key);
                      setIsEditModalOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="编辑名称"
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
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>

                  {/* 删除按钮 */}
                  <button
                    onClick={() => {
                      if (confirm("确定要删除这个 API Key 吗？此操作无法撤销。")) {
                        onDeleteKey(key.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="Delete key"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingKey && (
        <EditApiKeyModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingKey(null);
          }}
          onSubmit={onUpdateKey}
          initialName={editingKey.name}
          keyId={editingKey.id}
        />
      )}
    </div>
  );
} 