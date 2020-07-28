<?php

namespace App\Http\Controllers\Reagent;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Reagent\moving;
use App\Models\Reagent\movings;
use App\Models\Reagent\moving_materials;

class MovingController extends Controller
{
    public function view()
    {
        return response()->json(movings::where('id_department', auth()->user()->getIdDepartment())->get(), 200);
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
}
