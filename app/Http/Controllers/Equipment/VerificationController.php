<?php
namespace App\Http\Controllers\Equipment;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Equipment\verifications;
use App\Models\Equipment\view_verifications;
use App\Models\Equipment\equipment_kit_equipment;
use App\Models\Equipment\equipment_kits;

class VerificationController extends Controller
{
	public function view()
	{
		return response()->json(view_verifications::orderBy('id', 'DESC')->get(), 200);
	}

	public function create(Request $req)
	{
		$data = $req;
		DB::transaction(function() use ($req, $data){
			$verification = verifications::create([
					'id_status_check' => 1,
					'date_create' => date('Y-m-d'),
					'id_user' => auth()->user()->getId()
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

	public function play($id)
	{
		DB::transaction(function() use($id){
			$kits = equipment_kit_equipment::where('id_checks', $id)->get();
			foreach ($kits as $kit)
			{
				if(!$kit->is_received_before)
					throw new \Exception('Чтобы "отправить" заявку, необходимо "получить" выбранное оборудование');	
			}
			verifications::where('id', $id)->update(['date_submit' => date('Y-m-d'), 'id_status_check' => 2]);
		});
	}

	public function before($check, $id)
	{
		DB::transaction(function() use($id){
			equipment_kit_equipment::where('id', $id)->update(['is_received_before' => true]);
		});
	}

	public function after($check, $id)
	{
		DB::transaction(function() use($id, $check){
			if(!verifications::where('id', $check)->get()[0]['date_submit'])
				throw new \Exception('Для смены статуса оборудования, необходимо "отправить" заявку');
			equipment_kit_equipment::where('id', $id)->update(['is_received_after' => true]);
			verifications::where('id', $check)->update(['id_status_check' => 3]);
		});
	}

	 public function check_delete($id)
	 {
		DB::transaction(function() use($id){
			$ver = verifications::where('id', $id)->get();
			if($ver[0]['id_status_check'] === 2 || $ver[0]['id_status_check'] === 3)
				throw new \Exception("Удаление завершенной заявки не допустимо");
			$ver[0]->delete();
		});
	 }

	public function eq_delete($id)
	{
		DB::transaction(function() use($id){
			equipment_kit_equipment::where('id', $id)->delete();
		});
	 }
}
