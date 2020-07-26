<?php

namespace App\Http\Controllers\Reagent;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

use App\Models\Reagent\expenses;
use App\Models\Reagent\correction;
use App\Models\Reagent\corrections;

class CorrectionController extends Controller
{
	public function view()
	{
		return response()->json(corrections::where('id_department', auth()->user()->getIdDepartment())->get(), 200);
	}

	public function allowUpdate($id, Request $req)
	{
		DB::transaction(function() use($req, $id){
			correction::where('id', $id)->update(['id_status' => 2, 'date_response' => date('Y-m-d')]);
			expenses::where('id', $req->input('id_outgo'))->update(['amount' => $req->input('amount')]);
		});
	}

	public function denyUpdate($id)
	{
		DB::transaction(function() use($id){
			correction::where('id', $id)->update(['id_status' => 3, 'date_response' => date('Y-m-d')]);
		});
	}
}