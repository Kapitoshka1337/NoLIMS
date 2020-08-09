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
    	$writeoff = writeoff::select('*', DB::raw('ROUND(SUM(total), 1) as total'))->where('id_department', auth()->user()->getIdDepartment())->whereBetween('date_order', [$req->get('start'), $req->get('end')])->groupBy('date_order')->groupBy('id_material')->get();
        return response()->json($writeoff, 200);
    }
}
