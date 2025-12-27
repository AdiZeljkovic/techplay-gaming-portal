export function SkeletonHomeItem() {
    return (
        <div className="flex flex-col md:flex-row gap-6 p-4 mb-6 rounded-2xl glass-dark border border-white/5">
            <div className="w-full md:w-[320px] aspect-video bg-[#1a2336] animate-pulse rounded-xl" />
            <div className="flex-1 flex flex-col pt-1 space-y-3">
                <div className="w-24 h-5 bg-[#1a2336] animate-pulse rounded-full" />
                <div className="w-3/4 h-8 bg-[#1a2336] animate-pulse rounded-lg" />
                <div className="w-1/2 h-8 bg-[#1a2336] animate-pulse rounded-lg" />
                <div className="w-1/3 h-4 bg-[#1a2336] animate-pulse rounded-full mt-2" />
                <div className="w-full h-16 bg-[#1a2336] animate-pulse rounded-lg mt-2" />
            </div>
        </div>
    );
}

export function SkeletonCard() {
    return (
        <div className="glass-dark rounded-xl overflow-hidden border border-white/5 h-80 animate-pulse">
            <div className="h-48 bg-white/5" />
            <div className="p-5 space-y-3">
                <div className="h-4 bg-white/10 rounded w-1/2" />
                <div className="h-6 bg-white/10 rounded w-3/4" />
                <div className="h-4 bg-white/10 rounded w-full" />
            </div>
        </div>
    );
}
