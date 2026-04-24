<?php

namespace Database\Factories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
                'title' => $this->faker->randomElement([
                'Pour concrete slab: Lot 14',
                'Frame external walls: Lot 14',
                'Install roof trusses: Lot 9',
                'Electrical rough-in: Lot 3',
                'Final plumbing inspection: Lot 7',
                'Complete waterproofing: Level 2',
                'Electrical rough-in: Lot 4',
            ]),
            'description' => $this->faker->sentence(),
            'priority'    => $this->faker->randomElement(['low', 'medium', 'high']),
            'status'      => $this->faker->randomElement(['todo', 'inprogress', 'done']),
        ];
    }
}
