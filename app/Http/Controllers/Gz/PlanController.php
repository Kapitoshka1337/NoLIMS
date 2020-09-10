<?php
namespace App\Http\Controllers\Gz;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Http\Controllers\Controller;
use App\Models\Gz\gz_viewplan1;
use App\Models\Gz\gz_methodplanyear;
use App\Models\Gz\gz_methodplan;

class PlanController extends Controller
{
	public function view($id)
	{
		return response()->json(gz_viewplan1::where('id_vet', $id)->get(), 200);
	}

	public function create(Request $req)
	{
		DB::transaction(function() use ($req){
			$mpy = gz_methodplanyear::create([
				'id_method' => $req->input('id_method'),
				'id_vetstation' => $req->input('id_vetstation'),
				'id_animal'=> $req->input('id_animal'),
				'plan' => $req->input('plan')
			]);
			$quarters = $req->input('quarter');
			$block_plan = explode(',', $req->input('block_plan'));
			$i = 0;
			foreach ($req->input('quarter') as $quarter)
			{
				$arr[] = array(
					'id_block' => (int)$quarters[$i],
					'block_plan' => (int)$block_plan[$i],
					'id_mpy' => $mpy['id']
				);
				$i++;
			}
			gz_methodplan::insert($arr);
		});
	}

	public function quarter_create(Request $req)
	{
		DB::transaction(function() use ($req){
			$method = gz_methodplan::where('id', $req->input('id_method'))->get();
			gz_methodplan::insert([
				'id_block' => $req->input('quarter')[0],
				'block_plan' => $req->input('block_plan'),
				'id_mpy' => $method[0]['id_mpy'],
			]);
		});
	}

	public function update(Request $req)
	{
		DB::transaction(function() use ($req){
			gz_methodplan::where('id', $req->input('id_mp'))->update(['block_plan' => $req->input('block')]);
			gz_methodplanyear::where('id', $req->input('id_mpy'))->update(['plan' => $req->input('plan')]);
		});
	}
}