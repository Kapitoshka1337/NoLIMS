<?php

namespace App\Http\Controllers\Department;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\DepartmentModel;

class DepartmentController extends Controller
{
    public function view()
    {
        return response()->json(DepartmentModel::get(), 200);
    }
}
