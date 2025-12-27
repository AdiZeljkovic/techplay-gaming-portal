'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, Clock, Eye, X } from 'lucide-react';
import { Video } from '@/lib/videoService';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoGridProps {
    videos: Video[];
}

export function VideoGrid({ videos }: VideoGridProps) {
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    const getYoutubeId = (url: string) => {
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? match[1] : null;
    };

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
                <div
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className="group relative block aspect-video rounded-xl overflow-hidden bg-[#1a1f2e] cursor-pointer border border-white/5 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/10"
                >
                    <Image
                        src={video.thumbnail_url || `https://img.youtube.com/vi/${getYoutubeId(video.youtube_url)}/maxresdefault.jpg`}
                        alt={video.title}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-60 transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-red-600/90 rounded-full flex items-center justify-center group-hover:scale-110 transition shadow-lg shadow-red-600/50 backdrop-blur-sm">
                            <Play className="w-6 h-6 text-white ml-1 fill-white" />
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                        <h3 className="text-white font-bold line-clamp-1 group-hover:text-red-400 transition">{video.title}</h3>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-300">
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {video.published_at ? new Date(video.published_at).toLocaleDateString() : new Date(video.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            ))}

            {/* Video Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl shadow-red-900/20 border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <iframe
                                src={`https://www.youtube.com/embed/${getYoutubeId(selectedVideo.youtube_url)}?autoplay=1&rel=0`}
                                title={selectedVideo.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
