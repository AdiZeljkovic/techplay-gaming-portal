
export interface User {
    id: string;
    username: string;
    name?: string;
    email?: string;
    avatar: string;
    profile_photo_url?: string;
    level: number;
    rank_id?: number;
    role: 'User' | 'Admin' | 'Editor' | 'Member' | 'Guest' | string;
    roles?: { id: number; name: string }[];
    profile?: {
        bio?: string;
        biography?: string;
        avatar_url?: string;
        profile_picture_path?: string;
        banner_url?: string;
        level?: number;
        xp?: number;
        computer_specs?: {
            cpu?: string;
            gpu?: string;
            ram?: string;
            storage?: string;
            motherboard?: string;
            case?: string;
            monitor?: string;
            consoles?: string[];
        };
    };
    banner?: string;
    socialIdentities?: Array<{
        provider: string;
        provider_id: string;
    }>;
    xp?: number;
    xp_progress?: number;
    xp_next_level?: number;
    rank?: {
        name: string;
        icon: string;
    };
    achievements?: Achievement[];
    threads_count?: number;
    posts_count?: number;
    reviews_count?: number;
    orders_count?: number;
    postsCount?: number;
    reviewsCount?: number;
    ordersCount?: number;
    rep?: number;
    bio?: string;
}

export interface Game {
    id: number;
    slug: string;
    name: string;
    released: string;
    background_image: string;
    rating: number;
    rating_top: number;
    metacritic?: number;
    genres: { name: string }[];
    developers: { name: string }[];
    description_raw?: string;
    platforms?: string[];
    tags?: string[];
}

export interface Post {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    coverImageAlt?: string;
    category: 'News' | 'Review' | 'Tech' | 'Guide' | 'Feature' | 'Video' | 'Promo' | 'Opinion' | string;
    section?: 'news' | 'reviews' | 'tech' | 'guides';
    subcategory?: string;
    author: User;
    date: string;
    rating?: number;
    views: number;
    tags?: string[];
    status: 'Draft' | 'Published';
    comments_count?: number;
    seo?: {
        title?: string;
        description?: string;
        keywords?: string;
    };
}

export interface Comment {
    id: string | number;
    user: User;
    body: string;
    created_at: string;
    likes_count: number;
    parent_id: number | null;
    replies?: Comment[];
    is_liked?: boolean;
}

export interface ForumCategory {
    id: string;
    name: string;
    description: string;
    slug: string;
    parent_id?: string;
    icon?: string;
    color?: string;
    replies?: number;
    is_section?: boolean;
    children?: ForumCategory[];
    threadCount?: number;
}

export interface ForumThread {
    id: string;
    categoryId: string;
    title: string;
    author: User;
    replies: number;
    views: number;
    lastPost: string;
    isPinned?: boolean;
    isLocked?: boolean;
    tags?: string[];
}

export interface ForumPost {
    id: string;
    threadId: string;
    user: User;
    content: string;
    date: string;
    isOp?: boolean;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    gallery: string[];
    category: string;
    description: string;
    features: string[];
    sizes?: string[];
    colors?: string[];
    rating: number;
    reviews: number;
    isNew?: boolean;
    isSale?: boolean;
}

export interface GuideSection {
    title: string;
    content: string;
    image?: string;
    tips?: string[];
}

export interface GuideDetail {
    id: string;
    game: string;
    title: string;
    author: User;
    lastUpdated: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Hardcore' | 'Nightmare';
    image: string;
    intro: string;
    toc: string[];
    sections: GuideSection[];
    checklist?: string[];
    stats?: { label: string; value: string }[];
}

export interface PcSpecs {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    motherboard: string;
    case: string;
    monitor: string;
    consoles: string[];
}

export interface Achievement {
    id: string;
    title?: string;
    name?: string;
    description: string;
    icon: string;
    date?: string;
    xpValue?: number;
    xp?: number;
    isUnlocked?: boolean;
    is_unlocked?: boolean;
    progress?: number;
    rarity?: string;
}

export interface GamingAccount {
    platform: 'Steam' | 'PlayStation' | 'Xbox' | 'Discord' | 'Twitch';
    username: string;
    connected: boolean;
}

export interface Friend {
    id: string;
    username: string;
    avatar: string;
    status: 'Online' | 'In-Game' | 'Offline';
    level: number;
    role: string;
}

export interface UserProfile extends User {
    bio: string;
    banner: string;
    joinDate: string;
    xpCurrent: number;
    xpNextLevel: number;
    specs: PcSpecs;
    accounts: GamingAccount[];
    achievements: Achievement[];
    friends: Friend[];
}

export interface Message {
    id: number;
    conversation_id: number;
    user_id: string; // or number depending on backend, keeping string to match User.id
    body: string;
    read_at?: string;
    created_at: string;
}

export interface Conversation {
    id: number;
    name?: string;
    avatar?: string;
    user_id: string; // The other user
    last_message?: string;
    last_message_at?: string;
    unread_count?: number;
    updated_at: string;
}
