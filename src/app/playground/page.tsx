"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import { useApiKeys } from "@/hooks/useApiKeys";

export default function Playground() {
  const [apiKey, setApiKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { validateApiKey } = useApiKeys();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      showToast.error("Please enter an API key");
      return;
    }

    setIsSubmitting(true);

    try {
      const isValid = await validateApiKey(apiKey.trim());

      if (isValid) {
        showToast.success("Valid API key, /protected can be accessed");
        localStorage.setItem("validApiKey", apiKey.trim());
        router.push("/protected");
      } else {
        showToast.error("Invalid API key");
      }
    } catch (error) {
      showToast.error(`Error validating API key ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h1 className="text-2xl font-semibold mb-6">API Playground</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="apiKey"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              API Key
            </label>
            <input
              id="apiKey"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your API key"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter a valid API key to access the protected page
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {isSubmitting
              ? "Validating..."
              : "Validate & Access Protected Page"}
          </button>
        </form>
      </div>
    </div>
  );
}
