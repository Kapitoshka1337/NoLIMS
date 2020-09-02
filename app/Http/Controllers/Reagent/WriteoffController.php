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
		$writeoff = writeoff::select('id_department','id_material', 'date_order', 'date_usage', 'material', 'id_measure', 'measure', 'id_order_measure','order_measure', 'density', 'amount', 'total', 'packing_name',DB::raw('SUM(total) as total'))->where('id_department', auth()->user()->getIdDepartment())->whereBetween('date_usage', [$req->input('start'), $req->input('end')])->groupBy('date_order')->groupBy('id_material')->get();
		return response()->json($writeoff, 200);
	}
}
