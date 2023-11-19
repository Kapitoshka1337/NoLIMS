<?php
namespace App\Http\Controllers\Reagent;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Reagent\reagent_dashboard;

class DashboardController extends Controller
{
	public function dashboard()
	{
		return response()->json(array(
			'total' => reagent_dashboard::where('id_department', auth()->user()->getIdDepartment())
			->where('total_percent', '<=', '40')
			->where('archive', 0)
			->get(),
			'date' => reagent_dashboard::where('id_department', auth()->user()->getIdDepartment())
			->where('shelf_life', '<', date('Y-m-d', strtotime('+60 days')))
			->where('archive', 0)
			->get()
		));
	}
}