<?php
namespace App\Http\Controllers\Equipment;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Equipment\equipment_repair_requests;
use App\Models\Equipment\equipment_repair_request;
use App\Models\Equipment\equipment_equipment;

class RepairController extends Controller
{
	public function view()
	{
		return response()->json(equipment_repair_requests::get(), 200);
	}

	public function create($id, Request $req)
	{
		DB::transaction(function() use($id, $req){
			equipment_repair_request::insert([
				'id_equipment' => $id,
				'id_user' => auth()->user()->getId(),
				'problem' => $req->input('problem'),
				'id_status' => 1,
				'date_request' => date('Y-m-d')
			]);
		});
	}

	public function allow($id)
	{
		DB::transaction(function() use($id){
			$repair = equipment_repair_request::where('id', $id)->get();
			$repair[0]->update([
				'executor' => auth()->user()->getId(),
				'id_status' => 2,
				'date_start' => date('Y-m-d')
			]);
			equipment_equipment::where('id', $repair[0]->id_equipment)->update(['is_repair' => 1]);
		});
	}

	public function deny($id, Request $req)
	{
		DB::transaction(function() use($id, $req){
			equipment_repair_request::where('id', $id)->update([
				'executor' => auth()->user()->getId(),
				'id_status' => 4,
				'date_end' => date('Y-m-d'),
				'date_start' => date('Y-m-d'),
				'request_report' => $req->input('report')
			]);
		});
	}

	public function finish($id, Request $req)
	{
		DB::transaction(function() use($id, $req){
			$repair = equipment_repair_request::where('id', $id)->get();
			$repair[0]->update([
				'executor' => auth()->user()->getId(),
				'id_status' => 3,
				'date_end' => date('Y-m-d'),
				'date_start' => date('Y-m-d'),
				'request_report' => $req->input('report')
			]);
			equipment_equipment::where('id', $repair[0]->id_equipment)->update(['is_repair' => 0]);
		});
	}
}