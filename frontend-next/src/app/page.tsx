import { articleService } from '@/lib/articleService';
import Link from 'next/link';
import { ChevronRight, Flame, Star, Cpu, PlayCircle, BookOpen, Play } from 'lucide-react';
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel';
import { HomeListItem } from '@/components/home/HomeListItem';
import Sidebar from '@/components/common/Sidebar';
import { SpotlightCard } from '@/components/UI';

export const dynamic = 'force-dynamic'; // Prevent static prerendering

async function getHomeData() {
  try {
    const [featured, latest, mostRead, forumThreads, newsData, reviewsData, opinionsData, techData] = await Promise.all([
      articleService.getFeatured(),
      articleService.getLatest(),
      articleService.getMostRead(),
      articleService.getForumThreads(),
      articleService.getArticles({ section: 'news', limit: 5 }),
      articleService.getArticles({ section: 'reviews', limit: 5 }),
      articleService.getArticles({ category: 'Opinions', limit: 5 }),
      articleService.getArticles({ section: 'tech', limit: 5 })
    ]);

    // Fallback logic using the larger 'latest' pool (30 items)
    // This ensures that even if the specific API call fails (e.g. wrong category name), 
    // we can still populate the sections from the latest feed.
    const latestNews = newsData.length > 0 ? newsData : latest.filter(p =>
      p.section === 'news' ||
      (!p.section && (!p.category || p.category.toLowerCase() === 'news' || p.category.toLowerCase() === 'gaming'))
    ).slice(0, 5);

    const latestReviews = reviewsData.length > 0 ? reviewsData : latest.filter(p =>
      p.section === 'reviews' ||
      (!p.section && (p.tags?.some(t => t.toLowerCase().includes('review')) || p.category?.toLowerCase().includes('review')))
    ).slice(0, 5);

    const opinions = opinionsData.length > 0 ? opinionsData : latest.filter(p =>
      p.category?.toLowerCase() === 'opinions' ||
      p.tags?.some(t => t.toLowerCase() === 'opinion')
    ).slice(0, 5);

    const hardwareLab = techData.length > 0 ? techData : latest.filter(p =>
      p.section === 'tech' ||
      p.category?.toLowerCase() === 'tech' ||
      p.category?.toLowerCase() === 'hardware'
    ).slice(0, 5);

    return {
      featured: featured.length > 0 ? featured : latest.slice(0, 5),
      latestNews,
      latestReviews,
      opinions,
      hardwareLab,
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
      opinions: [],
      hardwareLab: [],
      latest: [],
      mostRead: [],
      forumThreads: []
    };
  }
}

export default async function HomePage() {
  const { featured, latestNews, latestReviews, opinions, hardwareLab, mostRead, forumThreads } = await getHomeData();

  return (
    <div className="bg-[var(--bg-body)] min-h-screen">
      {/* HERO CAROUSEL */}
      <FeaturedCarousel items={featured} />

      {/* MAIN CONTENT GRID */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-[1400px]">
        {/* LEFT COLUMN (8 cols) */}
        <div className="lg:col-span-8 space-y-16">

          {/* 1. LATEST NEWS */}
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-[var(--border-subtle)] pb-4">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                <span className="w-2 h-8 bg-red-500 rounded-full" />
                Latest News
              </h2>
              <Link href="/category/news" className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                View All <ChevronRight size={12} />
              </Link>
            </div>
            <div className="space-y-4">
              {latestNews.length > 0 ? latestNews.map((post, index) => (
                <HomeListItem key={post.id} post={post} accentColor="text-red-500" priority={index < 2} />
              )) : (
                <div className="p-8 text-center text-gray-500 bg-[var(--bg-surface-2)] rounded-2xl border border-[var(--border-subtle)]">
                  No latest news found.
                </div>
              )}
            </div>
          </section>

          {/* 2. LATEST REVIEWS */}
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-[var(--border-subtle)] pb-4">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                <span className="w-2 h-8 bg-yellow-500 rounded-full" />
                Latest Reviews
              </h2>
              <Link href="/category/reviews" className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                View All <ChevronRight size={12} />
              </Link>
            </div>
            <SpotlightCard className="relative p-1 rounded-3xl overflow-hidden bg-[var(--bg-surface-2)] border border-[var(--border-subtle)]" spotlightColor="rgba(234, 179, 8, 0.15)">
              <div className="bg-[var(--bg-surface)] rounded-[20px] p-6 sm:p-8">
                {latestReviews.length > 0 ? (
                  <div className="space-y-6">
                    {latestReviews.map(post => (
                      <HomeListItem key={post.id} post={{ ...post, rating: post.rating || 8.5 }} accentColor="text-yellow-400" showRating={true} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">No recent reviews found</div>
                )}
              </div>
            </SpotlightCard>
          </section>

          {/* 3. OPINIONS */}
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-[var(--border-subtle)] pb-4">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                <span className="w-2 h-8 bg-purple-500 rounded-full" />
                Opinions
              </h2>
              <Link href="/category/opinions" className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                View All <ChevronRight size={12} />
              </Link>
            </div>
            <div className="space-y-4">
              {opinions.length > 0 ? opinions.map(post => (
                <HomeListItem key={post.id} post={post} accentColor="text-purple-400" />
              )) : (
                <div className="p-8 text-center text-gray-500 bg-[var(--bg-surface-2)] rounded-2xl border border-[var(--border-subtle)]">
                  No opinion pieces found.
                </div>
              )}
            </div>
          </section>

          {/* 4. HARDWARE LAB */}
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
            <div className="space-y-4">
              {hardwareLab.length > 0 ? hardwareLab.map(post => (
                <HomeListItem key={post.id} post={post} accentColor="text-blue-400" />
              )) : (
                <div className="p-8 text-center text-gray-500 bg-[var(--bg-surface-2)] rounded-2xl border border-[var(--border-subtle)]">
                  No tech news found.
                </div>
              )}
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
