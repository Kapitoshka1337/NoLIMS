<?php

namespace App\Http\Controllers\Reagent;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

use App\Models\Reagent\writeoff;

class WriteoffController extends Controller
{
    public function view(Request $req)
    {
    	// return response()->json($req->input('start'), 200);
    	$writeoff = writeoff::select('*', DB::raw('ROUND(SUM(total), 1) as total'))->where('id_department', auth()->user()->getIdDepartment())->whereBetween('date_usage', [$req->input('start'), $req->input('end')])->groupBy('date_order')->groupBy('id_material')->get();
        return response()->json($writeoff, 200);
    }
}
