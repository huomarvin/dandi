"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";

export default function Protected() {
  const router = useRouter();

  useEffect(() => {
    const validApiKey = localStorage.getItem('validApiKey');
    if (!validApiKey) {
      showToast.error("No valid API key found");
      router.push('/playground');
    }
  }, [router]);

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h1 className="text-2xl font-semibold mb-4">Protected Page</h1>
        <p className="text-gray-600">
          This is a protected page that can only be accessed with a valid API key.
        </p>
      </div>
    </div>
  );
} 