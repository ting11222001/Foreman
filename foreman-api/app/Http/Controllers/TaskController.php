<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

/** 
 * Eloquent is Laravel's ORM. ORM means you write PHP instead of raw SQL. So Task::all() is the same as SELECT * FROM tasks but in PHP.
*/
class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     * GET /api/tasks
     */
    public function index()
    {
        return Task::all();
    }

    /**
     * Store a newly created resource in storage.
     * POST /api/tasks
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string',
            'description' => 'nullable|string',
            'priority'    => 'in:low,medium,high',
            'status'      => 'in:todo,inprogress,done',
        ]);

        $task = Task::create($data);
        return response()->json($task, 201);
    }

    /**
     * Update the specified resource in storage.
     * PUT /api/tasks/{task}
     */
    public function update(Request $request, Task $task)
    {
        $data = $request->validate([
            'title'       => 'sometimes|string',
            'description' => 'nullable|string',
            'priority'    => 'in:low,medium,high',
            'status'      => 'in:todo,inprogress,done',
        ]);

        $task->update($data);
        return response()->json($task);
    }

    /**
     * Remove the specified resource from storage.
     * DELETE /api/tasks/{task}
     */
    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(null, 204);
    }
}
