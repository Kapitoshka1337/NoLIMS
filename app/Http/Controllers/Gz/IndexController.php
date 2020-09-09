<?php
namespace App\Http\Controllers\Gz;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Http\Controllers\Controller;
use App\Models\Gz\getall;
use App\Models\Gz\gz_mpforvet;
use App\Models\Gz\gz_vetstation;
use App\Models\Gz\gz_region;
use App\Models\Gz\gz_animal;
use App\Models\Gz\gz_farm;
use App\Models\Gz\gz_pathdata;

class IndexController extends Controller
{
	public function view()
	{
		return response()->json(getall::get() ,200);
	}

	public function create(Request $req)
	{
		DB::beginTransaction();
			try
			{
				$pp = gz_pathdata::create([
					'id_method_plan' => $req->input('id_method_plan'),
					'id_animal' => $req->input('id_animal'),
					'id_farm' => $req->input('id_farm'),
					'id_region' => $req->input('id_region'),
					'id_vetstation' => $req->input('id_vetstation'),
					'place_of_selection' => $req->input('place_of_selection'),
					'date_add' => date('Y-m-d'),
					'date_enter' => $req->input('date_enter'),
					'amount' => $req->input('amount'),
					'id_empl' => auth()->user()->getId()
				]);
			}
			catch(ValidationException $e)
			{
				DB::rollback();
			}
			catch(\Exception $e)
			{
				DB::rollback();
				throw $e;
			}
			DB::commit();
		return response()->json($pp, 200);
	}
	public function create_farm(Request $req)
	{
		DB::transaction(function() use ($req){
			gz_farm::insert($req->all());
		});	
	}
}