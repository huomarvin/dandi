import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/toast";

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  status: "active" | "inactive";
  usage: number;
}

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 生成新的 API Key
  const generateApiKey = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let key = "tvly-";
    for (let i = 0; i < 32; i++) {
      key += chars[Math.floor(Math.random() * chars.length)];
    }
    return key;
  };

  // 加载 API Keys
  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error("Error fetching API keys:", error);
      showToast.error("Failed to fetch API keys");
    } finally {
      setIsLoading(false);
    }
  };

  // 创建新的 API Key
  const createApiKey = async (name: string) => {
    try {
      const newKey = generateApiKey();
      const { data, error } = await supabase
        .from("api_keys")
        .insert([
          {
            name,
            key: newKey,
            status: "active",
            usage: 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setApiKeys([data, ...apiKeys]);
      showToast.success("API key created successfully");
      return true;
    } catch (error) {
      console.error("Error creating API key:", error);
      showToast.error("Failed to create API key");
      return false;
    }
  };

  // 更新 API Key
  const updateApiKey = async (id: string, name: string) => {
    try {
      const { error } = await supabase
        .from("api_keys")
        .update({ name })
        .eq("id", id);

      if (error) throw error;

      setApiKeys(
        apiKeys.map((key) =>
          key.id === id ? { ...key, name } : key
        )
      );
      showToast.success("API key updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating API key:", error);
      showToast.error("Failed to update API key");
      return false;
    }
  };

  // 删除 API Key
  const deleteApiKey = async (id: string) => {
    try {
      const { error } = await supabase.from("api_keys").delete().eq("id", id);

      if (error) throw error;
      setApiKeys(apiKeys.filter((key) => key.id !== id));
      showToast.success("API key deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting API key:", error);
      showToast.error("Failed to delete API key");
      return false;
    }
  };

  // 更新 API Key 状态
  const updateKeyStatus = async (id: string, currentStatus: "active" | "inactive") => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const { error } = await supabase
        .from("api_keys")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setApiKeys(
        apiKeys.map((key) =>
          key.id === id ? { ...key, status: newStatus } : key
        )
      );

      if (newStatus === "active") {
        showToast.success("API key activated");
      } else {
        showToast.success("API key deactivated");
      }
      return true;
    } catch (error) {
      console.error("Error updating API key status:", error);
      showToast.error("Failed to update API key status");
      return false;
    }
  };

  // 添加验证 API Key 的方法
  const validateApiKey = async (key: string) => {
    try {
      const { data, error } = await supabase
        .from("api_keys")
        .select("id")
        .eq("key", key)
        .eq("status", "active") // 只验证激活状态的 key
        .single();

      if (error) {
        return false;
      }

      return !!data;
    } catch (error) {
      console.error("Error validating API key:", error);
      return false;
    }
  };

  return {
    apiKeys,
    isLoading,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    updateKeyStatus,
    validateApiKey  // 导出新方法
  };
} 