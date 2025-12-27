<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $section = request('section');

        $categories = \Illuminate\Support\Facades\Cache::remember("categories_list_{$section}", 60 * 60, function () use ($section) {
            $query = Category::withCount('articles');

            if ($section) {
                $query->where('section', $section);
            }

            return $query->get();
        });

        return CategoryResource::collection($categories);
    }

    public function show(Category $category)
    {
        return new CategoryResource($category->loadCount('articles'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']);

        return new CategoryResource(Category::create($validated));
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
        ]);

        $category->update($validated);
        return new CategoryResource($category);
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return response()->json(['message' => 'Category deleted']);
    }
}
