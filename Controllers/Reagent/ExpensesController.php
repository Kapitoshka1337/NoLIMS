<?php

namespace App\Http\Controllers\Reagent;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\reagent\expenses;

class ExpensesController extends Controller
{
    public function create(Request $req)
    {
        $expenses = new expenses();
        $expenses->id_department = 14;
        $expenses->id_arrival_material = $req->input('id_arrival');
        $expenses->id_user = 11;
        $expenses->amount = $req->input('amount');
        $expenses->date_usage = $req->input('date');
        $expenses->date_record = date('Y-m-d');
        $expenses->id_moving_type = 2;
        if($expenses->save())
            return response()->json($expenses, 200);
    }
}
