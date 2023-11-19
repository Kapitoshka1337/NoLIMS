<?php

namespace App\Http\Controllers\Structure;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\researches\indicators;
use App\Models\share\users;
use App\Models\share\department;
use App\Models\share\rank;
use App\role;

class StructureController extends Controller
{
    public function structure()
    {
        return response()->json(['departments' => department::select('id', 'title')->orderBy('title', 'ASC')->get(), 'ranks' => rank::orderBy('title', 'ASC')->get()], 200);
    }

    public function users()
    {
        return response()->json(users::select('name')->orderBy('name', 'ASC', 'id')->get(), 200);
    }

    public function usersON()
    {
        return response()->json(users::select('id', 'name')->get(), 200);
    }
    public function departments()
    {
        return response()->json(department::select('id', 'title')->get(), 200);
    }
    public function indicators()
    {
        return response()->json(indicators::select('id', 'name')->get(), 200);
    }

    public function role()
    {
        return response()->json(role::select('id', 'role')->get(), 200);
    }
}
