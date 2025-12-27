import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Reviews | TechPlay',
    description: 'Definitive scores. Unbiased analysis. The reviews that matter.',
};

export default function ReviewsPage() {
    redirect('/category/reviews');
}
