<?php

namespace Database\Seeders;

use App\Models\Localization;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class LocalizationSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'latitude' => '-23.550520',
                'longitude' => '-46.633308',
                'source' => 'wifi',
                'is_home' => true,
                'last_time_seen' => Carbon::now()->subMinutes(5),
            ],
            [
                'latitude' => '-23.551234',
                'longitude' => '-46.634567',
                'source' => 'beacon',
                'is_home' => false,
                'last_time_seen' => Carbon::now()->subMinutes(2),
            ],
            [
                'latitude' => '-23.552345',
                'longitude' => '-46.635678',
                'source' => 'mobile',
                'is_home' => false,
                'last_time_seen' => Carbon::now(),
            ],
            [
                'latitude' => '-23.554000',
                'longitude' => '-46.632000',
                'source' => 'wifi',
                'is_home' => false,
                'last_time_seen' => Carbon::now()->subMinutes(10),
            ],
            [
                'latitude' => '-23.548000',
                'longitude' => '-46.636000',
                'source' => 'beacon',
                'is_home' => false,
                'last_time_seen' => Carbon::now()->subMinutes(15),
            ],
            [
                'latitude' => '-23.556000',
                'longitude' => '-46.638000',
                'source' => 'mobile',
                'is_home' => false,
                'last_time_seen' => Carbon::now()->subMinutes(20),
            ],
        ];

        foreach ($data as $item) {
            Localization::create($item);
        }
    }
}
