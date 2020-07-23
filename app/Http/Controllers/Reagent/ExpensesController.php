<?php

namespace App\Http\Controllers\Reagent;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

use App\Models\Reagent\expenses;
use App\Models\Reagent\expenses_view;
use App\Models\Reagent\correction;
use App\Models\Reagent\reagent_arrival_material;

class ExpensesController extends Controller
{

    public function view()
    {
        return response()->json(expenses_view::get(), 200);
    }

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

    public function create_correct(Request $req)
    {
        $correction = correction::create($req->all());
        return response()->json($correction, 200);
    }

    public function renewal(Request $req, $id)
    {
        DB::transaction(function() use ($req, $id){
        reagent_arrival_material::where('id', $id)->update(['shelf_life' => $req['renewal']['date']]);
        $expenses = new expenses();
        $expenses->id_department = 14;
        $expenses->id_arrival_material = $id;
        $expenses->id_user = 11;
        $expenses->amount = $req->input('amount');
        $expenses->date_usage = $req->input('date');
        $expenses->date_record = date('Y-m-d');
        $expenses->id_moving_type = 4;
        $expenses->save();
        });
    }
}
