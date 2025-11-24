export default function Loading() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full animate-bounce bg-gray-600" />
      <div className="w-3 h-3 rounded-full animate-bounce bg-gray-600 delay-75" />
      <div className="w-3 h-3 rounded-full animate-bounce bg-gray-600 delay-150" />
    </div>
  );
}
