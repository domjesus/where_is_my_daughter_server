<?php

namespace App\Http\Controllers;

use App\Models\Localization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LocalizationController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 20);
        return response()->json(
            Localization::orderBy('last_time_seen', 'desc')
                ->orderBy('created_at', 'desc')
                ->paginate($perPage)
        );
    }

    public function store(Request $request)
    {
        Log::info("Received localization data: " . json_encode($request->all()));
        // Log::info("Headers: ", $request->headers->all());

        $validated = $request->validate([
            'latitude' => 'required',
            'longitude' => 'required',
            'source' => 'required|in:wifi,beacon,mobile',
            'is_home' => 'required|boolean',
            'ble_active' => 'required|boolean',
            'network_type' => 'required|string',
        ]);


        $isHome = $validated['is_home'];

        // Automatic is_home detection based on specific coordinates provided by user
        if ($validated['latitude'] == "30.0292432" && $validated['longitude'] == "-81.574487") {
            $isHome = true;
        }

        $localization = Localization::create([
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'source' => $validated['source'],
            'is_home' => $isHome,
            'ble_active' => $validated['ble_active'],
            'network_type' => $validated['network_type'],
            'last_time_seen' => now(),
        ]);

        return response()->json($localization, 201);
    }
}
