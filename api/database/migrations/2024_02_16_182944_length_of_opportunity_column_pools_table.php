<?php

use App\Enums\PoolOpportunityLength;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pools', function (Blueprint $table) {
            $table->string('opportunity_length')->nullable();
        });

        DB::table('pools')->update([
            'opportunity_length' => PoolOpportunityLength::VARIOUS->name,
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pools', function (Blueprint $table) {
            $table->dropColumn('opportunity_length');
        });
    }
};
