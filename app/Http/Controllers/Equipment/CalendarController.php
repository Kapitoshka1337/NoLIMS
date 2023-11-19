<?php
namespace App\Http\Controllers\Equipment;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Equipment\equipment_calendar_services;

class CalendarController extends Controller
{
	public function view()
	{
		return response()->json(equipment_calendar_services::get(), 200);
	}
}