import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const { auth, isLoading, error, clearError, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);

  const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    setFiles(files);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const handleDelete = async () => {
    files.forEach(async (file) => {
      await fs.delete(file.path);
    });
    await kv.flush();
    loadFiles();
    clearError();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="mx-10 my-12 p-8 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <span className="block text-gray-700 font-semibold mb-1">
          Authenticated as:
        </span>
        <span className="text-blue-700 font-mono">{auth.user?.username}</span>
      </div>
      <div className="mb-4 text-gray-800 font-medium">Existing files:</div>
      <div
        className="
          flex flex-col gap-2 mb-8
          md:grid md:grid-cols-2 md:gap-4
          lg:grid-cols-3
        "
      >
        {files.length === 0 ? (
          <div className="text-gray-400 italic col-span-full">No files found.</div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className="flex flex-row items-center gap-3 px-3 py-2 bg-gray-100 rounded-md"
            >
              <span className="text-gray-700">{file.name}</span>
            </div>
          ))
        )}
      </div>
      <div>
        <button
          className="bg-red-600 hover:bg-red-700 transition-colors text-white px-6 py-2 rounded-md font-semibold shadow focus:outline-none focus:ring-2 focus:ring-red-400"
          onClick={handleDelete}
        >
          Wipe App Data
        </button>
      </div>
    </div>
  );
};

export default WipeApp;