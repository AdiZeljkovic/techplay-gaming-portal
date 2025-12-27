<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        channels: __DIR__ . '/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->statefulApi();
        $middleware->trustProxies(at: '*');

        // Exclude API routes from CSRF verification (SPA uses Sanctum tokens)
        $middleware->validateCsrfTokens(except: [
            'api/*',
            'sanctum/csrf-cookie',
        ]);

        // Security headers for all web requests
        $middleware->web(append: [
            \App\Http\Middleware\SecurityHeaders::class,
        ]);

        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // In production, return generic JSON errors without stacktrace
        $exceptions->render(function (\Throwable $e, \Illuminate\Http\Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                // Let Laravel handle Validation exceptions normally (422)
                if ($e instanceof \Illuminate\Validation\ValidationException) {
                    return null;
                }

                // Handle Authentication explicitly (401)
                if ($e instanceof \Illuminate\Auth\AuthenticationException) {
                    return response()->json(['message' => 'Unauthenticated.'], 401);
                }

                $status = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;

                // In production, hide detailed error messages for 500 errors
                $message = $e->getMessage();
                if (!config('app.debug') && $status >= 500) {
                    $message = 'An unexpected error occurred. Please try again later.';
                }

                return response()->json([
                    'message' => $message,
                    'error' => class_basename($e),
                ], $status);
            }
        });
    })->create();
