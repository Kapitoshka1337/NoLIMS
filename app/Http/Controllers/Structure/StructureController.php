<?php

namespace App\Http\Controllers\Structure;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\share\users;
use App\Models\share\department;
use App\Models\share\rank;

class StructureController extends Controller
{
    public function structure()
    {
        return response()->json(['departments' => department::select('id', 'title')->orderBy('title', 'ASC')->get(), 'ranks' => rank::orderBy('title', 'ASC')->get()], 200);
    }    

    public function users()
    {
        return response()->json(users::select('name')->orderBy('name', 'ASC')->get(), 200);
    }

    // public function ranks()
    // {
    //     return response()->json(rank::get(), 200);
    // }

    // public function departments()
    // {
    //     return response()->json(department::select('id', 'title')->get(), 200);
    // }
}
