<?php

namespace App\Http\Controllers\Reagent;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Reagent\arrivals;
use App\Models\Reagent\arrival_materials;

class ArrivalsController extends Controller
{
    public function view()
    {
        return response()->json(arrivals::get(), 200);
    }

    public function materials($id)
    {
        $arr_mat = arrival_materials::where('id', $id)->get();
        return response()->json($arr_mat, 200);
    }
}
