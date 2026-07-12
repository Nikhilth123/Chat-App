  export function DateSeparator({ label }: { label: string }) {
  return (
    <div className="flex justify-center my-4">
      <div className="px-4 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-200 shadow-sm">
        {label}
      </div>
    </div>
  );
}