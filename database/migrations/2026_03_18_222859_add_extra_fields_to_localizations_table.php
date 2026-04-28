<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('localizations', function (Blueprint $table) {
            $table->boolean('ble_active')->default(false)->after('is_home');
            $table->string('network_type')->nullable()->after('ble_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('localizations', function (Blueprint $table) {
            $table->dropColumn(['ble_active', 'network_type']);
        });
    }
};
