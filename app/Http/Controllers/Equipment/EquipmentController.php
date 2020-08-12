<?php
namespace App\Http\Controllers\Equipment;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Equipment\equipment_equipment_details;
use App\Models\Equipment\equipment_type;
use App\Models\Equipment\equipment_function_of_use;
use App\Models\Equipment\equipment_object_study;
use App\Models\Equipment\equipment_history_date_checks;
use App\Models\Equipment\equipment_history_movings;
use App\Models\Equipment\equipment_metrolog_list_work_for_equipment;

class EquipmentController extends Controller
{
	public function view($id)
	{
		$eq = array(
			'equipment' => equipment_equipment_details::find($id),
			'type' => equipment_type::get(),
			'function' => equipment_function_of_use::get(),
			'studies' => equipment_object_study::get(),
			'history_checks' => equipment_history_date_checks::where('id_equipment', $id)->get(),
			'history_moving' => equipment_history_movings::where('id_equipment', $id)->get(),
			'maintance' => equipment_metrolog_list_work_for_equipment::where('id_equipment', $id)->get()
		);
		return response()->json($eq, 200);
	}

	public function checks($id)
	{
		return response()->json(equipment_history_date_checks::where('id_equipment', $id)->get(), 200);
	}

	public function types()
	{
    	return response()->json(equipment_type::get(), 200);
	}

	public function functionsOfUse()
	{
    	return response()->json(equipment_function_of_use::get(), 200);
	}

	public function objectStudies()
	{
		return response()->json(equipment_object_study::get(), 200);
	}
}