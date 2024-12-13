interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, limit: number) => void;
}

export function CreateApiKeyModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateApiKeyModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("keyName") as string;
    const limit = Number(formData.get("limit")) || 1000;
    onSubmit(name, limit);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Create a new API key</h2>
        <p className="text-gray-600 mb-6">
          Enter a name and limit for the new API key.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2">
              <span className="text-gray-700">Key Name</span>
              <span className="text-gray-500 text-sm ml-2">
                — A unique name to identify this key
              </span>
            </label>
            <input
              type="text"
              name="keyName"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Key Name"
              required
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                name="hasLimit"
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 mr-2"
              />
              <span className="text-gray-700">Limit monthly usage*</span>
            </label>
            <input
              type="number"
              name="limit"
              defaultValue={1000}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <p className="text-gray-500 text-sm mt-2">
              * If the combined usage of all your keys exceeds your plan&apos;s
              limit, all requests will be rejected.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
