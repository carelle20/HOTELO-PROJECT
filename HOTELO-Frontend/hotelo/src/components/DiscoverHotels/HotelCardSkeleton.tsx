export default function HotelCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-44 sm:h-48 bg-slate-200" />

      <div className="p-6 space-y-4">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />

        <div className="h-3 bg-slate-200 rounded w-1/3" />

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="h-5 bg-slate-200 rounded w-1/3" />
          <div className="h-8 bg-slate-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
}
