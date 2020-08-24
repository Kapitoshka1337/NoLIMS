<?php
namespace App\Http\Controllers\Equipment;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Equipment\verifications;
use App\Models\Equipment\equipment_kit_equipment;
use App\Models\Equipment\equipment_kits;

class VerificationController extends Controller
{
	public function view()
	{
		return response()->json(verifications::orderBy('id', 'DESC')->get(), 200);
	}

	public function create(Request $req)
	{
		$data = $req;
		DB::transaction(function() use ($req, $data){
			$verification = verifications::create([
					'id_status_check' => 1,
					'date_create' => date('Y-m-d')
    			]
			);
			foreach ($req->all() as $eq)
			{
				$arr[] = array(
					'id_checks' => $verification->id,
					'id_department' => $eq['id_department'],
					'id_equipment' => $eq['id_equipment']
				);
			};
			equipment_kit_equipment::insert($arr);
		});
	}

	public function equipments($id)
	{
		$arr_mat = equipment_kits::where('id_checks', $id)->get();
		return response()->json($arr_mat, 200);
	}

	public function play($check)
	{
		// return response()->json($id, 200);
		// DB::transaction(function() use($id){
		// 	equipment_kit_equipment::where('id', $id)->update(['is_received_before' => 1]);
		// });
	}

	public function before($check, $id)
	{
		DB::transaction(function() use($id){
			equipment_kit_equipment::where('id', $id)->update(['is_received_before' => 1]);
		});
	}

	public function after($check, $id)
	{
		DB::transaction(function() use($id){
			equipment_kit_equipment::where('id', $id)->update(['is_received_after' => 1]);
		});
	}
}
