import { shopService } from '@/lib/shopService';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Truck, ShieldCheck, RefreshCw, ChevronLeft } from 'lucide-react';
import { Metadata, ResolvingMetadata } from 'next';
import AddToCartButton from '@/components/shop/AddToCartButton';
import ProductReviews from '@/components/shop/ProductReviews';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata(
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const product = await shopService.getProductById(parseInt(id));

    if (!product) {
        return { title: 'Product Not Found' };
    }

    return {
        title: product.name,
        description: product.description,
        openGraph: {
            images: [product.image],
        },
    };
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params;
    const product = await shopService.getProductById(parseInt(id));

    if (!product) {
        notFound();
    }

    const gallery = Array.isArray(product.gallery) ? product.gallery : [];
    const features = Array.isArray(product.features) ? product.features : [];

    return (
        <div className="min-h-screen bg-[var(--bg-body)] pt-24 pb-16">
            <div className="container mx-auto px-4">
                {/* Back Link */}
                <Link href="/shop" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold mb-8">
                    <ChevronLeft size={16} /> Back to Shop
                </Link>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square rounded-2xl overflow-hidden glass-dark border border-white/10">
                            <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized={product.image?.includes('localhost') || product.image?.includes('placeholder')} />
                            {product.isNew && (
                                <span className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white font-bold rounded">NEW</span>
                            )}
                            {product.isSale && (
                                <span className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white font-bold rounded">SALE</span>
                            )}
                        </div>
                        {gallery.length > 0 && (
                            <div className="grid grid-cols-4 gap-4">
                                {gallery.map((img, i) => (
                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden glass-dark border border-white/10 cursor-pointer hover:border-red-500 transition">
                                        <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" unoptimized />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div>
                        <div className="mb-2 text-red-500 font-bold uppercase tracking-wider text-sm">{product.category}</div>
                        <h1 className="text-4xl font-black text-white mb-4">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex text-yellow-500">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-600'}`} />
                                ))}
                            </div>
                            <span className="text-gray-400">({product.reviews} reviews)</span>
                        </div>

                        <div className="text-3xl font-black text-white mb-6">${product.price}</div>

                        <p className="text-gray-300 text-lg leading-relaxed mb-8 border-b border-white/10 pb-8">
                            {product.description}
                        </p>

                        <div className="space-y-6 mb-8">
                            {/* Features */}
                            {features.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-white mb-3">Key Features</h3>
                                    <ul className="grid grid-cols-2 gap-2">
                                        {features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-2 text-gray-400">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Add to Cart Component (Client Side) */}
                            <AddToCartButton product={product} />

                            {/* Guarantees */}
                            <div className="grid grid-cols-3 gap-4 pt-6 mt-8 border-t border-white/10">
                                <div className="text-center">
                                    <Truck className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                    <div className="text-xs text-gray-500">Fast Delivery</div>
                                </div>
                                <div className="text-center">
                                    <ShieldCheck className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                    <div className="text-xs text-gray-500">2 Year Warranty</div>
                                </div>
                                <div className="text-center">
                                    <RefreshCw className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                    <div className="text-xs text-gray-500">30 Day Returns</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <ProductReviews productId={product.id} />
            </div>
        </div>
    );
}

