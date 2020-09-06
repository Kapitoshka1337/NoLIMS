<?php
namespace App\Http\Controllers\Gz;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Gz\gz_getall2;

class ReportController extends Controller
{
	public function view()
	{
		return response()->json(gz_getall2::get() ,200);
	}
}