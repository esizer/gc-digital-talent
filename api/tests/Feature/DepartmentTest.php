<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

class DepartmentTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use WithFaker;

    protected $baseUser;

    protected $adminUser;

    protected $department;

    protected $toBeDeleted;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        $this->setUpFaker();
        $this->bootRefreshesSchemaCache();

        $this->baseUser = User::create([
            'email' => 'base-user@test.com',
            'sub' => 'base-user@test.com',
        ]);
        $this->baseUser->syncRoles([
            'guest',
            'base_user',
            'pool_operator',
            'request_responder',
        ]);

        $this->adminUser = User::create([
            'email' => 'admin-user@test.com',
            'sub' => 'admin-user@test.com',
        ]);
        $this->adminUser->addRole('platform_admin');

        $this->department = Department::factory()->create();
        $this->toBeDeleted = Department::factory()->create();
    }

    /**
     * Test base user can view any
     *
     * @return void
     */
    public function testViewAnyDepartment()
    {
        $this->actingAs($this->baseUser, 'api')
            ->graphQL('query { departments { id } }')
            ->assertJsonFragment(['id' => $this->department->id]);
    }

    /**
     * Test base user can view any
     *
     * @return void
     */
    public function testViewDepartment()
    {

        $variables = ['id' => $this->department->id];

        $query =
            /** @lang GraphQL */
            '
            query Get($id: UUID!) {
                department(id: $id) {
                    id
                }
            }
        ';

        $this->actingAs($this->baseUser, 'api')
            ->graphQL($query, $variables)
            ->assertJsonFragment($variables);
    }

    /**
     * Test updating a department
     *
     * @return void
     */
    public function testUpdateDepartment()
    {

        $variables = [
            'id' => $this->department->id,
            'department' => [
                'name' => [
                    'en' => 'New Name (EN)',
                    'fr' => 'New Name (FR)',
                ],
            ],
        ];

        $mutation =
            /** @lang GraphQL */
            '
            mutation UpdateDepartment($id: ID!, $department: UpdateDepartmentInput!) {
                updateDepartment(id: $id, department: $department) {
                    id
                    name {
                        en
                        fr
                    }
                }
            }
        ';

        $this->actingAs($this->baseUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertJsonFragment(['id' => $this->department->id, 'name' => $variables['department']['name']]);
    }

    /**
     * Test creation of department
     *
     * @return void
     */
    public function testCreateDepartment()
    {
        $variables = [
            'department' => [
                'departmentNumber' => 1,
                'name' => [
                    'en' => 'New Name (EN)',
                    'fr' => 'New Name (FR)',
                ],
            ],
        ];

        $mutation =
            /** @lang GraphQL */
            '
            mutation Create($department: CreateDepartmentInput!) {
                createDepartment(department: $department) {
                    id
                    name {
                        en
                        fr
                    }
                }
            }
        ';

        $this->actingAs($this->baseUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertJsonFragment(['name' => $variables['department']['name']]);
    }

    /**
     * Test base user cannot update or delete
     *
     * @return void
     */
    public function testDeleteDepartment()
    {
        $variables = ['id' => $this->toBeDeleted->id];

        $mutation =
            /** @lang GraphQL */
            '
            mutation Delete($id: ID!) {
                deleteDepartment(id: $id) {
                    id
                }
            }
        ';

        $this->actingAs($this->baseUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertJsonFragment(['id' => $this->toBeDeleted->id]);
    }
}
