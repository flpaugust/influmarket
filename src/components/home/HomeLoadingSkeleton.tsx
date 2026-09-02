import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomeLoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
          {/* Header Banner Skeleton */}
          <div className="card-editorial p-8 bg-white border border-stone-200/80">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-stone-200" />
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-stone-200 rounded-lg" />
                  <div className="h-4 w-72 bg-stone-100 rounded-lg" />
                </div>
              </div>
              <div className="h-10 w-36 bg-stone-200 rounded-xl" />
            </div>
          </div>

          {/* Quick Metrics Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card-editorial p-5 bg-white border border-stone-200/80 h-24 flex flex-col justify-between">
              <div className="h-3 w-28 bg-stone-200 rounded" />
              <div className="h-6 w-16 bg-stone-300 rounded" />
            </div>
            <div className="card-editorial p-5 bg-white border border-stone-200/80 h-24 flex flex-col justify-between">
              <div className="h-3 w-32 bg-stone-200 rounded" />
              <div className="h-6 w-20 bg-stone-300 rounded" />
            </div>
            <div className="card-editorial p-5 bg-white border border-stone-200/80 h-24 flex flex-col justify-between">
              <div className="h-3 w-24 bg-stone-200 rounded" />
              <div className="h-6 w-24 bg-stone-300 rounded" />
            </div>
          </div>

          {/* Feed Skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-56 bg-stone-200 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="card-editorial p-6 bg-white border border-stone-200/80 h-64 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-24 bg-stone-200 rounded" />
                      <div className="h-5 w-16 bg-stone-200 rounded-full" />
                    </div>
                    <div className="h-5 w-40 bg-stone-300 rounded" />
                    <div className="h-3 w-full bg-stone-100 rounded" />
                    <div className="h-3 w-3/4 bg-stone-100 rounded" />
                  </div>
                  <div className="h-8 w-full bg-stone-200 rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
