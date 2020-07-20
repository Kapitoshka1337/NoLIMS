<?php

namespace App\Http\Controllers\Reagent;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Reagent\arrivals;

class ArrivalsController extends Controller
{
    public function view()
    {
        return response()->json(arrivals::get(), 200);
    }
}
