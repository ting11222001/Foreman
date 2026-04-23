<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Task extends Model
{
    /**
     * HasUuids is needed because your migration uses uuid for the id, not the default integer: $table->uuid('id')->primary();
     * HasUuids tells Laravel "this model uses UUIDs, generate one automatically when creating a row"
     */
    use HasUuids;
    
    /**
     * $fillable tells Laravel: "only these fields are allowed to be mass-assigned." 
     * Laravel filters the data before writing it.
     */
    protected $fillable = [
        'title',
        'description',
        'priority',
        'status',
    ];
}
