import { articleService } from '@/lib/articleService';
import Link from 'next/link';
import { ChevronRight, Flame, Star, Cpu, PlayCircle, BookOpen, Play } from 'lucide-react';
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel';
import { HomeListItem } from '@/components/home/HomeListItem';
import Sidebar from '@/components/common/Sidebar';

export const dynamic = 'force-dynamic'; // Prevent static prerendering

async function getHomeData() {
  try {
    const [featured, latest, mostRead, videos, guidesData, forumThreads] = await Promise.all([
      articleService.getFeatured(),
      articleService.getLatest(),
      articleService.getMostRead(),
      articleService.getVideos(),
      articleService.getGuides(),
      articleService.getForumThreads()
    ]);

    // Filter posts by section if needed
    const latestNews = latest.filter(p =>
      p.section === 'news' || (!p.section && (!p.category || p.category === 'News' || p.category === 'Gaming'))
    ).slice(0, 5);

    const latestReviews = latest.filter(p =>
      p.section === 'reviews' || (!p.section && (p.tags?.includes('Review') || p.category === 'Review' || p.category === 'Reviews'))
    ).slice(0, 3);

    const techFeatures = latest.filter(p =>
      p.section === 'tech' || (!p.section && (p.category === 'Tech' || p.category === 'Hardware'))
    ).slice(0, 3);

    return {
      featured: featured.length > 0 ? featured : latest.slice(0, 5),
      latestNews,
      latestReviews,
      techFeatures,
      guides: guidesData,
      videos,
      latest,
      mostRead,
      forumThreads
    };
  } catch (error) {
    console.error('Failed to fetch home data:', error);
    return {
      featured: [],
      latestNews: [],
      latestReviews: [],
      techFeatures: [],
      guides: [],
      videos: [],
      latest: [],
      mostRead: [],
      forumThreads: []
    };
  }
}

export default async function HomePage() {
  const { featured, latestNews, latestReviews, techFeatures, guides, videos, latest, mostRead, forumThreads } = await getHomeData();

  return (
    <div className="bg-[var(--bg-body)] min-h-screen">
      {/* HERO CAROUSEL */}
      <FeaturedCarousel items={featured} />

      {/* MAIN CONTENT GRID */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-[1400px]">
        {/* LEFT COLUMN (8 cols) */}
        <div className="lg:col-span-8 space-y-16">

          {/* 1. LATEST HEADLINES */}
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-[var(--border-subtle)] pb-4">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                <span className="w-2 h-8 bg-red-500 rounded-full" />
                Latest Headlines
              </h2>
              <Link href="/category/news" className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                View All <ChevronRight size={12} />
              </Link>
            </div>

            <div>
              {latestNews.length > 0 ? latestNews.map((post, index) => (
                <HomeListItem key={post.id} post={post} accentColor="text-red-500" priority={index < 2} />
              )) : (
                <div className="p-8 text-center text-gray-500 bg-[var(--bg-surface-2)] rounded-2xl border border-[var(--border-subtle)]">
                  No latest news found. Check back soon!
                </div>
              )}
            </div>
          </section>

          {/* 2. THE VERDICT (Reviews) */}
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-[var(--border-subtle)] pb-4">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                <span className="w-2 h-8 bg-yellow-500 rounded-full" />
                The Verdict
              </h2>
              <Link href="/reviews/latest" className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                All Reviews <ChevronRight size={12} />
              </Link>
            </div>
            <div className="relative p-6 sm:p-8 rounded-3xl overflow-hidden bg-[var(--bg-surface-2)] border border-[var(--border-subtle)]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="relative z-10">
                {latestReviews.length > 0 ? latestReviews.map(post => (
                  <HomeListItem key={post.id} post={{ ...post, rating: post.rating || 8.5 }} accentColor="text-yellow-400" showRating={true} />
                )) : (
                  <div className="text-center py-10 text-gray-500">No recent reviews</div>
                )}
              </div>
            </div>
          </section>

          {/* 3. HARDWARE LAB (Tech) */}
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-[var(--border-subtle)] pb-4">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-500 rounded-full" />
                Hardware Lab
              </h2>
              <Link href="/category/tech" className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                Tech Hub <ChevronRight size={12} />
              </Link>
            </div>
            <div>
              {techFeatures.map(post => (
                <HomeListItem key={post.id} post={post} accentColor="text-blue-400" />
              ))}
            </div>
          </section>

          {/* 4. GUIDES & MEDIA */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Watch */}
            <div className="bg-[var(--bg-surface-2)] rounded-2xl p-6 border border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 mb-6 text-purple-400">
                <PlayCircle size={24} />
                <h3 className="font-black uppercase tracking-wider text-white">Watch</h3>
              </div>
              <div className="space-y-4">
                {videos.length > 0 ? videos.slice(0, 3).map((v, i) => (
                  <Link href={`/post/${v.slug}`} key={i} className="flex gap-4 group cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors">
                    <div className="w-24 aspect-video rounded-lg overflow-hidden relative shrink-0">
                      {v.image && <img src={v.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white"><Play size={10} fill="currentColor" /></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-200 group-hover:text-purple-400 leading-tight mb-1">{v.title}</h4>
                      <span className="text-[10px] text-gray-500 font-bold uppercase">{v.date}</span>
                    </div>
                  </Link>
                )) : (
                  <div className="text-gray-500 text-sm">No videos found.</div>
                )}
              </div>
            </div>

            {/* Learn */}
            <div className="bg-[var(--bg-surface-2)] rounded-2xl p-6 border border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 mb-6 text-green-400">
                <BookOpen size={24} />
                <h3 className="font-black uppercase tracking-wider text-white">Learn</h3>
              </div>
              <div className="space-y-4">
                {guides.length > 0 ? guides.slice(0, 3).map((g, i) => (
                  <HomeListItem key={i} post={g} accentColor="text-green-400" compact={true} />
                )) : (
                  <div className="text-gray-500 text-sm">No guides found.</div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (4 cols) - SIDEBAR */}
        <div className="lg:col-span-4 space-y-8">
          <Sidebar latestNews={latestNews} mostRead={mostRead} forumThreads={forumThreads} />
        </div>
      </div>
    </div>
  );
}
