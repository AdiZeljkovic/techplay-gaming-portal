<x-filament-widgets::widget>
    <x-filament::section>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <a href="{{ route('filament.admin.resources.articles.create') }}"
                style="display: flex; align-items: center; gap: 12px; padding: 16px 24px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border-radius: 12px; text-decoration: none; font-weight: 600; box-shadow: 0 4px 15px rgba(99,102,241,0.3); transition: all 0.2s;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                New Article
            </a>

            <a href="{{ route('filament.admin.resources.products.create') }}"
                style="display: flex; align-items: center; gap: 12px; padding: 16px 24px; background: linear-gradient(135deg, #10b981, #14b8a6); color: white; border-radius: 12px; text-decoration: none; font-weight: 600; box-shadow: 0 4px 15px rgba(16,185,129,0.3); transition: all 0.2s;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                New Product
            </a>

            <a href="{{ route('filament.admin.resources.orders.index') }}"
                style="display: flex; align-items: center; gap: 12px; padding: 16px 24px; background: linear-gradient(135deg, #f59e0b, #f97316); color: white; border-radius: 12px; text-decoration: none; font-weight: 600; box-shadow: 0 4px 15px rgba(245,158,11,0.3); transition: all 0.2s;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                View Orders
            </a>

            <a href="{{ route('filament.admin.resources.users.index') }}"
                style="display: flex; align-items: center; gap: 12px; padding: 16px 24px; background: linear-gradient(135deg, #3b82f6, #06b6d4); color: white; border-radius: 12px; text-decoration: none; font-weight: 600; box-shadow: 0 4px 15px rgba(59,130,246,0.3); transition: all 0.2s;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Manage Users
            </a>

            <a href="/" target="_blank"
                style="display: flex; align-items: center; gap: 12px; padding: 16px 24px; background: linear-gradient(135deg, #64748b, #475569); color: white; border-radius: 12px; text-decoration: none; font-weight: 600; box-shadow: 0 4px 15px rgba(100,116,139,0.3); transition: all 0.2s;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                View Site
            </a>
        </div>
    </x-filament::section>
</x-filament-widgets::widget>