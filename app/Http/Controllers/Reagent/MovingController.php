<?php

namespace App\Http\Controllers\Reagent;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Reagent\moving;
use App\Models\Reagent\movings;
use App\Models\Reagent\expenses;
use App\Models\Reagent\moving_materials;
use App\Models\Reagent\reagent_arrivals;
use App\Models\Reagent\reagent_arrival_material;
use App\Models\Reagent\reagent_movings_materials;
use App\Models\Reagent\raegent_material_for_moving;

class MovingController extends Controller
{
    public function view()
    {
        return response()->json(movings::where('id_department_from', auth()->user()->getIdDepartment())->orWhere('id_department_to', auth()->user()->getIdDepartment())->get(), 200);
    }

    public function create(Request $req)
    {
    	// return response()->json($req, 200);
		DB::transaction(function() use ($req){
			$moving = moving::create([
			        'id_department_from' => auth()->user()->getIdDepartment(),
			        'id_department_to' => $req->input('id_department_to'),
			        'id_user' => auth()->user()->getId(),
			        // 'date_moving' => ,
			        'created_at' => date('Y-m-d'),
			        'id_moving_status' => 1
    			]
			);
			foreach ($req->input('materials') as $material)
			{
				$arr[] = array(
					'id_moving' => $moving->id,
					'id_arrival_material' => $material['id_arrival_material'],
					'amount' => $material['amount'],
					'id_location' => $material['id_location']
				);
			};
			$moving_materials = moving_materials::insert($arr);
		});
    }

	public function materials($id)
	{
		$arr_mat = reagent_movings_materials::where('id_moving', $id)->get();
		return response()->json($arr_mat, 200);
	}

	public function allowUpdate($id, $from)
	{
		DB::transaction(function() use($id, $from){
			$order = reagent_arrivals::create([
				'num_order' => 0,
				'date_order' => date('Y-m-d'),
				'id_department' => $from,
				'id_moving_type' => 3
			]);
			$materials = raegent_material_for_moving::where('id_moving', $id)->get();
			foreach ($materials as $material)
			{
				$arr[] = array(
					'id_arrival' => $order->id,
					'id_material' => $material['id_material'],
					'packing_name' => $material['packing_name'],
					'amount' => $material['amount'],
					'id_location' => $material['id_location'],
					'shelf_life' => $material['shelf_life'],
					'date_create' => $material['date_create']
				);
			};
			$order_materials = reagent_arrival_material::insert($arr);
			foreach ($materials as $material)
			{
				$arr1[] = array(
					'id_department' => auth()->user()->getIdDepartment(),
					'id_arrival_material' => $material['id'],
					'id_user' => auth()->user()->getId(),
					'amount' => $material['amount'],//из передачи
					'date_usage' => date('Y-m-d'),
					'date_record' => date('Y-m-d'),
					'id_moving_type' => 3
				);
			};
			$expenses = expenses::insert($arr1);
			moving::where('id', $id)->update(['id_moving_status' => 2, 'date_moving' => date('Y-m-d')]);
		});
	}

	public function denyUpdate($id)
	{
		DB::transaction(function() use($id){
		});
	}
}
