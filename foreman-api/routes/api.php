<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;

/**
 * GET /api/tasks → index
 * POST /api/tasks → store
 * PUT /api/tasks/{task} → update
 * DELETE /api/tasks/{task} → destroy
 */
Route::apiResource('tasks', TaskController::class);
