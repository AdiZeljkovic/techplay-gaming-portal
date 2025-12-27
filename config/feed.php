<?php

return [
    'feeds' => [
        'main' => [
            /*
             * Here you can specify which class and method will return
             * the items that should appear in the feed. For example:
             * [App\Model::class, 'getAllFeedItems']
             *
             * You can also pass an argument to that method:
             * ['App\Model', 'getAllFeedItems', 'argument']
             */
            'items' => 'App\Models\Article@getFeedItems',

            /*
             * The feed will be available on this url.
             */
            'url' => '/feed',

            'title' => 'TechPlay - Gaming News & Reviews',
            'description' => 'The latest gaming news, reviews, and tech updates.',
            'language' => 'en-US',

            /*
             * The image to display for the feed. For Atom feeds, this is displayed as
             * a banner. For RSS and JSON feeds, it is displayed as an icon.
             * An absolute URL is required.
             */
            'image' => '',

            /*
             * The format of the feed. Acceptable values are 'rss', 'atom', or 'json'.
             */
            'format' => 'rss',

            /*
             * The view that will render the feed.
             */
            'view' => 'feed::rss',

            /*
             * The mime type to be used in the <link> tag.
             * Set to an empty string to automatically generate the correct mime type.
             */
            'type' => '',

            /*
             * The content type for the feed response.
             * Set to an empty string to automatically generate the correct content type.
             */
            'contentType' => '',
        ],
    ],
];
