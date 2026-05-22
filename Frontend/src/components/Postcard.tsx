import { Heart, MessageCircle } from "lucide-react";

export function Postcard() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm hover:shadow-md transition p-4">

      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-sm">Nikhil Thakur</p>
          <p className="text-xs text-gray-500">2 hours ago</p>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h2 className="font-semibold text-lg mb-1">
          Building My Online Judge 🚀
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Today I worked on implementing infinite scrolling and improving the UI.
          Still figuring out performance optimizations, but it's getting better day by day.
          Really excited to push this live soon!
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 text-gray-600 dark:text-gray-300 text-sm">
        <button className="flex items-center gap-2 hover:text-red-500 transition">
          <Heart size={18} />
          <span>24</span>
        </button>

        <button className="flex items-center gap-2 hover:text-blue-500 transition">
          <MessageCircle size={18} />
          <span>8</span>
        </button>
      </div>
    </div>
  );
}