<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->spa()
            ->id('admin')
            ->path('admin')
            ->login()
            ->brandName('TechPlay Admin')
            ->darkMode(true)
            ->colors([
                'primary' => Color::Rose,
                'danger' => Color::Red,
                'warning' => Color::Orange,
                'success' => Color::Emerald,
                'info' => Color::Sky,
                'gray' => Color::Slate,
            ])
            ->font('Inter')
            ->sidebarCollapsibleOnDesktop()
            ->databaseNotifications()
            ->navigationGroups([
                \Filament\Navigation\NavigationGroup::make()
                    ->label('Editorial')
                    ->icon('heroicon-o-newspaper')
                    ->collapsed(false),
                \Filament\Navigation\NavigationGroup::make()
                    ->label('Editorial Tools')
                    ->icon('heroicon-o-wrench-screwdriver')
                    ->collapsed(true),
                \Filament\Navigation\NavigationGroup::make()
                    ->label('E-Commerce')
                    ->icon('heroicon-o-shopping-cart')
                    ->collapsed(true),
                \Filament\Navigation\NavigationGroup::make()
                    ->label('Community')
                    ->icon('heroicon-o-users')
                    ->collapsed(true),
                \Filament\Navigation\NavigationGroup::make()
                    ->label('Users & Gamification')
                    ->icon('heroicon-o-user-group')
                    ->collapsed(true),
                \Filament\Navigation\NavigationGroup::make()
                    ->label('Settings')
                    ->icon('heroicon-o-cog-6-tooth')
                    ->collapsed(true),
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages([
                Pages\Dashboard::class,
            ])
            ->widgets([
                // Only essential widgets on dashboard
                \App\Filament\Widgets\StatsOverviewWidget::class,
                Widgets\AccountWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->plugins([
                \BezhanSalleh\FilamentShield\FilamentShieldPlugin::make(),
                \Saade\FilamentFullCalendar\FilamentFullCalendarPlugin::make(),
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
