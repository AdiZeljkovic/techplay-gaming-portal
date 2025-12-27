<?php
$filename = 'activision-objasnjava-zasto-u-call-of-duty-u-ostaje-povezivanje-zasnovano-na-vjestinama-694c38ef29835.jpg';
$m = Spatie\MediaLibrary\MediaCollections\Models\Media::where('file_name', $filename)->first();
if ($m) {
    echo "Media ID: $m->id\n";
    echo "Model Type: $m->model_type\n";
    echo "Model ID: $m->model_id\n";
    echo "Disk: $m->disk\n";
    echo "URL: " . $m->getUrl() . "\n";
} else {
    echo "Media record not found for file: $filename\n";
}
