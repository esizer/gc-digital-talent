<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            // standard platform data
            RolePermissionSeeder::class,
            ClassificationSeeder::class,
            DepartmentSeeder::class,
            GenericJobTitleSeeder::class,
            SkillFamilySeeder::class,
            SkillSeeder::class,
            TeamSeeder::class,

            // convenient test data
            UserTestSeeder::class,
        ]);
    }
}
