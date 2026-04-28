<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Localization extends Model
{
    protected $fillable = [
        'latitude',
        'longitude',
        'source',
        'is_home',
        'ble_active',
        'network_type',
        'last_time_seen',
    ];

    protected $casts = [
        'is_home' => 'boolean',
        'ble_active' => 'boolean',
        'last_time_seen' => 'datetime',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];
}
