<?php
namespace App\Http\Controllers\Gz;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Http\Controllers\Controller;
use App\Models\Gz\gz_mpforvet;
use App\Models\Gz\gz_vetstation;
use App\Models\Gz\gz_region;
use App\Models\Gz\gz_animal;
use App\Models\Gz\gz_farm;
use App\Models\Gz\gz_method;

class SupportController extends Controller
{
	private function getQuarter()
	{
		$month = date('n');
		if ($month < 4) return 1;
		else if ($month >= 4 && $month < 7) return 2;
		else if ($month >= 7 && $month < 10) return 3;
		else return 4;
	}

	public function create()
	{
		$eq = array(
			'vetstation' => gz_vetstation::get(),
			'region' => gz_region::get(),
			'farm' => gz_farm::get(),
			'animal' => gz_animal::get(),
			'method' => gz_mpforvet::where('id_block', $this->getQuarter())->get(),
		);
		return response()->json($eq, 200);
	}
	public function ycreate()
	{
		$eq = array(
			'vetstation' => gz_vetstation::get(),
			'animal' => gz_animal::get(),
			'method' => gz_method::get(),
		);
		return response()->json($eq, 200);
	}

	public function vetstations()
	{
		return response()->json(gz_vetstation::get() ,200);
	}

	public function animals()
	{
		return response()->json(gz_animal::get() ,200);
	}

	public function methods()
	{
		return response()->json(gz_methods::get() ,200);
	}
}