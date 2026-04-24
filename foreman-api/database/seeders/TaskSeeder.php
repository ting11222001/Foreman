<?php

namespace Database\Seeders;
use App\Models\Task;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Wipe existing rows first
        Task::truncate();

        // Seed exactly your 7 mock tasks
        $tasks = [
            ['title' => 'Pour concrete slab: Lot 14',       'description' => 'Site Work',      'priority' => 'medium', 'status' => 'todo'],
            ['title' => 'Frame external walls: Lot 14',     'description' => 'Site Work',      'priority' => 'medium', 'status' => 'todo'],
            ['title' => 'Install roof trusses: Lot 9',      'description' => 'Site Work',      'priority' => 'high', 'status' => 'inprogress'],
            ['title' => 'Electrical rough-in: Lot 3',       'description' => 'Electrical',     'priority' => 'low', 'status' => 'todo'],
            ['title' => 'Electrical rough-in: Lot 4',       'description' => 'Electrical',     'priority' => 'low', 'status' => 'todo'],
            ['title' => 'Final plumbing inspection: Lot 7', 'description' => 'Plumbing',       'priority' => 'high', 'status' => 'done'],
            ['title' => 'Complete waterproofing: Level 2',  'description' => 'Waterproofing',  'priority' => 'medium', 'status' => 'inprogress'],
        ];

        foreach ($tasks as $task) {
            Task::create($task);
        }
    }
}
