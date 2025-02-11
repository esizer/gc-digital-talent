<?php

namespace Database\Factories;

use App\Enums\LanguageAbility;
use App\Enums\OperationalRequirement;
use App\Enums\PoolStream;
use App\Enums\PositionDuration;
use App\Enums\WorkRegion;
use App\Models\ApplicantFilter;
use App\Models\Classification;
use App\Models\Pool;
use App\Models\Skill;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicantFilterFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ApplicantFilter::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'has_diploma' => $this->faker->boolean(),
            'has_disability' => $this->faker->boolean(),
            'is_indigenous' => $this->faker->boolean(),
            'is_visible_minority' => $this->faker->boolean(),
            'is_woman' => $this->faker->boolean(),
            'position_duration' => $this->faker->boolean() ? null : [PositionDuration::TEMPORARY->name], // null or request TEMPORARY
            'language_ability' => $this->faker->randomElement(array_column(LanguageAbility::cases(), 'name')),
            'location_preferences' => $this->faker->randomElements(
                array_column(WorkRegion::cases(), 'name'),
                $this->faker->numberBetween(1, 3)
            ),
            'operational_requirements' => $this->faker->optional->randomElements(
                array_column(OperationalRequirement::cases(), 'name'),
                $this->faker->numberBetween(1, 4)
            ),
        ];
    }

    /**
     * Create an ApplicantFilter where fields have a 50% chance to be null.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function sparse()
    {
        return $this->state(function (array $attributes) {
            $sparseAttributes = [];
            foreach ($attributes as $key => $value) {
                if ($this->faker->boolean(50)) {
                    $sparseAttributes[$key] = $value;
                }
            }

            return $sparseAttributes;
        });
    }

    /**
     * Create an ApplicantFilter where skills, classifications and pools have been added.
     * NOTE: before using this method, you must have already generated skills, classifications and Pools
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withRelationships(bool $sparse = false)
    {
        return $this->afterCreating(function (ApplicantFilter $filter) use ($sparse) {
            $minCount = $sparse ? 0 : 1;
            $classifications = Classification::inRandomOrder()->limit(
                $this->faker->numberBetween($minCount, 2)
            )->get();
            $filter->classifications()->saveMany($classifications);
            $skills = Skill::inRandomOrder()->limit(
                $this->faker->numberBetween($minCount, 2)
            )->get();
            $filter->skills()->saveMany($skills);

            $pools = Pool::whereNotNull('published_at')->inRandomOrder()->limit(
                $this->faker->numberBetween($minCount, 1)
            )->get();
            $filter->pools()->saveMany($pools);
            $filter->qualifiedClassifications()->saveMany($pools->flatMap(fn ($pool) => $pool->classifications));
            $stream = (empty($pools) || count($pools) === 0) ? $this->faker->randomElements(
                array_column(PoolStream::cases(), 'name'),
            ) : [$pools[0]->stream];
            $filter->qualified_streams = $stream;
            $filter->save();
        });
    }
}
