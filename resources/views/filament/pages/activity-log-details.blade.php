<div class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
        <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Date</h4>
            <p class="text-sm text-gray-900 dark:text-white">{{ $activity->created_at->format('Y-m-d H:i:s') }}</p>
        </div>
        <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Action</h4>
            <p class="text-sm text-gray-900 dark:text-white">{{ $activity->description }}</p>
        </div>
        <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Model</h4>
            <p class="text-sm text-gray-900 dark:text-white">
                {{ $activity->subject_type ? class_basename($activity->subject_type) : '-' }}
                #{{ $activity->subject_id }}</p>
        </div>
        <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">User</h4>
            <p class="text-sm text-gray-900 dark:text-white">{{ $activity->causer?->name ?? 'System' }}</p>
        </div>
    </div>

    @if($activity->properties && $activity->properties->count())
        <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Changes</h4>
            <pre
                class="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">{{ json_encode($activity->properties, JSON_PRETTY_PRINT) }}</pre>
        </div>
    @endif
</div>