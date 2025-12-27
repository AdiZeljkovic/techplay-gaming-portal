import { videoService } from '@/lib/videoService';
import { VideoGrid } from '@/components/video/VideoGrid';
import { Play } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Videos | TechPlay',
    description: 'Watch the latest game trailers, reviews, and gameplay features.',
};

export const dynamic = 'force-dynamic'; // Prevent static prerendering

export default async function VideoPage() {
    const videosSource = await videoService.getVideos(1);
    const videos = videosSource.data || [];

    return (
        <div className="min-h-screen bg-[#0f0b15]">
            <section className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                        <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white">Videos</h1>
                </div>

                {videos.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
                        <Play className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">No videos yet</h2>
                        <p className="text-gray-400">Check back soon for the latest content.</p>
                    </div>
                ) : (
                    <VideoGrid videos={videos} />
                )}
            </section>
        </div>
    );
}
