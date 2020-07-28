<?php

namespace App\Http\Controllers\Reagent;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Reagent\material;

class MovingController extends Controller
{
    public function view()
    {
        return response()->json(material::get(), 200);
    }
}
