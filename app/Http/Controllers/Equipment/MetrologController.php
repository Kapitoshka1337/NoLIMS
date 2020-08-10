<?php
namespace App\Http\Controllers\Equipment;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Equipment\equipment_metrolog_equipment;

class MetrologController extends Controller
{
    public function view()
    {
        return response()->json(equipment_metrolog_equipment::get(), 200);
    }
}
