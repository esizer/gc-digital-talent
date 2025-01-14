<?php

namespace Database\Factories;

use App\Enums\AssessmentStepType;
use App\Enums\OperationalRequirement;
use App\Enums\PoolLanguage;
use App\Enums\PoolOpportunityLength;
use App\Enums\PoolSkillType;
use App\Enums\PoolStream;
use App\Enums\PublishingGroup;
use App\Enums\SecurityStatus;
use App\Enums\SkillLevel;
use App\Models\AssessmentStep;
use App\Models\Classification;
use App\Models\GeneralQuestion;
use App\Models\Pool;
use App\Models\PoolSkill;
use App\Models\ScreeningQuestion;
use App\Models\Skill;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\Factory;

class PoolFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Pool::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $adminUserId = User::whereHas('roles', function (Builder $query) {
            $query->where('name', 'platform_admin');
        })->limit(1)
            ->pluck('id')
            ->first();
        if (is_null($adminUserId)) {
            $adminUserId = User::factory()->asAdmin()->create()->id;
        }

        $teamId = Team::inRandomOrder()
            ->limit(1)
            ->pluck('id')
            ->first();
        if (is_null($teamId)) {
            $teamId = Team::factory()->create()->id;
        }

        $name = $this->faker->unique()->company();

        // this is essentially the draft state
        return [
            'name' => ['en' => $name, 'fr' => $name],
            'user_id' => $adminUserId,
            'team_id' => $teamId,
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Pool $pool) {
            $classifications = Classification::inRandomOrder()->limit(1)->get();
            $skills = Skill::inRandomOrder()->limit(10)->get();
            $pool->classifications()->saveMany($classifications);

            foreach ($skills->slice(0, 5) as $skill) {
                $poolSkill = new PoolSkill();
                $poolSkill->skill_id = $skill->id;
                $poolSkill->type = PoolSkillType::ESSENTIAL->name;
                $poolSkill->required_skill_level = $this->faker->randomElement(array_column(SkillLevel::cases(), 'name'));
                $pool->poolSkills()->save($poolSkill);
            }
            foreach ($skills->slice(5, 5) as $skill) {
                $poolSkill = new PoolSkill();
                $poolSkill->skill_id = $skill->id;
                $poolSkill->type = PoolSkillType::NONESSENTIAL->name;
                $poolSkill->required_skill_level = $this->faker->randomElement(array_column(SkillLevel::cases(), 'name'));
                $pool->poolSkills()->save($poolSkill);
            }

            GeneralQuestion::factory()
                ->count(3)
                ->sequence(
                    ['sort_order' => 1],
                    ['sort_order' => 2],
                    ['sort_order' => 3],
                )
                ->create(['pool_id' => $pool->id]);

            $screeningAssessmentStep = AssessmentStep::factory()->create(
                [
                    'pool_id' => $pool->id,
                    'type' => AssessmentStepType::SCREENING_QUESTIONS_AT_APPLICATION->name,
                ]
            );
            ScreeningQuestion::factory()
                ->count(3)
                ->sequence(
                    ['sort_order' => 1],
                    ['sort_order' => 2],
                    ['sort_order' => 3],
                )
                ->create(
                    [
                        'pool_id' => $pool->id,
                        'assessment_step_id' => $screeningAssessmentStep->id,
                    ]
                );
        });
    }

    /**
     * Indicate that the pool is draft.
     */
    public function draft(): Factory
    {
        return $this->state(function (array $attributes) {
            // the base state is draft already
            return [];
        });
    }

    /**
     * Indicate that the pool is published.
     */
    public function published(): Factory
    {
        return $this->state(function (array $attributes) {
            $isRemote = $this->faker->boolean();
            $hasSpecialNote = $this->faker->boolean();

            return [
                // published in the past, closes in the future
                'published_at' => $this->faker->dateTimeBetween('-30 days', '-1 days'),

                'operational_requirements' => $this->faker->randomElements(array_column(OperationalRequirement::cases(), 'name'), 2),
                'key_tasks' => ['en' => $this->faker->paragraph().' EN', 'fr' => $this->faker->paragraph().' FR'],
                'your_impact' => ['en' => $this->faker->paragraph().' EN', 'fr' => $this->faker->paragraph().' FR'],
                'what_to_expect' => ['en' => $this->faker->paragraph().' EN', 'fr' => $this->faker->paragraph().' FR'],
                'security_clearance' => $this->faker->randomElement(array_column(SecurityStatus::cases(), 'name')),
                'advertisement_language' => $this->faker->randomElement(array_column(PoolLanguage::cases(), 'name')),
                'advertisement_location' => ! $isRemote ? ['en' => $this->faker->country(), 'fr' => $this->faker->country()] : null,
                'special_note' => ! $hasSpecialNote ? ['en' => $this->faker->paragraph().' EN', 'fr' => $this->faker->paragraph().' FR'] : null,
                'is_remote' => $isRemote,
                'stream' => $this->faker->randomElement(PoolStream::cases())->name,
                'process_number' => $this->faker->word(),
                'publishing_group' => $this->faker->randomElement(array_column(PublishingGroup::cases(), 'name')),
                'opportunity_length' => $this->faker->randomElement(array_column(PoolOpportunityLength::cases(), 'name')),
            ];
        });
    }

    /**
     * Indicate that the pool is closed.
     */
    public function closed(): Factory
    {
        return $this->published()->state(function (array $attributes) {
            return [
                'published_at' => $this->faker->dateTimeBetween('-6 months', '-2 months'),
                'closing_date' => $this->faker->dateTimeBetween('-1 months', '-1 day'),
            ];
        });
    }

    /**
     * Indicate that the pool is archived.
     */
    public function archived(): Factory
    {
        return $this->closed()->state(function (array $attributes) {
            return [
                'published_at' => $this->faker->dateTimeBetween('-12 months', '-6 months'),
                'closing_date' => $this->faker->dateTimeBetween('-6 months', '-2 months'),
                'archived_at' => $this->faker->dateTimeBetween('-1 month', '-1 day'),
            ];
        });
    }

    /**
     * Pool Candidates for this pool will appear in search results
     *
     * Note: That means only IT publishing groups
     *
     * @return void
     */
    public function candidatesAvailableInSearch()
    {
        return $this->state(function () {
            return [
                'publishing_group' => $this->faker->randomElement([
                    PublishingGroup::IT_JOBS->name,
                    PublishingGroup::IT_JOBS_ONGOING->name,
                ]),
            ];
        });
    }

    /** Add assessment steps to the pool with pool skills for a complete assessment plan
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withAssessments()
    {
        return $this->afterCreating(function (Pool $pool) {
            $step1 = AssessmentStep::factory()
                ->create(['pool_id' => $pool->id]);
            $step2 = AssessmentStep::factory()
                ->create(['pool_id' => $pool->id]);
            $poolSkillArray = $pool->poolSkills->pluck('id')->toArray();
            $step1->poolSkills()->sync(array_slice($poolSkillArray, 0, 5, true));
            $step2->poolSkills()->sync(array_slice($poolSkillArray, 5, 5, true));
        });
    }
}
