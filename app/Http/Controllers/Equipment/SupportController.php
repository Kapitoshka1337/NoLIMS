<?php
namespace App\Http\Controllers\Equipment;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Equipment\equipment_type;
use App\Models\Equipment\equipment_function_of_use;
use App\Models\Equipment\equipment_object_study;
use App\Models\Equipment\equipment_document_type;

class SupportController extends Controller
{
	public function docType()
	{
		return response()->json(equipment_document_type::get(), 200);
	}

	public function types()
	{
		return response()->json(equipment_type::get(), 200);
	}

	public function functionsOfUse()
	{
		return response()->json(equipment_function_of_use::get(), 200);
	}

	public function objectStudies()
	{
		return response()->json(equipment_object_study::get(), 200);
	}
}