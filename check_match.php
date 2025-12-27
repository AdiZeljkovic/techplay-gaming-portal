<?php
$slug = 'activision-objasnjava-zasto-u-call-of-duty-u-ostaje-povezivanje-zasnovano-na-vjestinama';
$a = App\Models\Article::where('slug', $slug)->first();
if ($a) {
    echo "Found Article ID: $a->id\n";
} else {
    echo "Not Found for slug: $slug\n";
    // Try LIKE
    $a = App\Models\Article::where('slug', 'like', 'activision-objasnjava%')->first();
    if ($a)
        echo "Found similar: $a->slug (ID: $a->id)\n";
}
