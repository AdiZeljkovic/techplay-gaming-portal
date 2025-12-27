<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

/*
|--------------------------------------------------------------------------
| SPA Fallback for Frontend Routes
|--------------------------------------------------------------------------
| When the React frontend is built and deployed with Laravel, this route
| catches all frontend paths and serves the SPA index.html.
| This enables BrowserRouter (clean URLs without #) to work properly.
|
| For development: The Vite dev server handles this automatically.
| For production: Uncomment the route below if serving frontend from Laravel.
*/

// Route::get('/{any}', function () {
//     return view('app'); // or return file_get_contents(public_path('index.html'));
// })->where('any', '^(?!api|admin|filament|storage).*$');

