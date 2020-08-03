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
        return response()->json(expenses_view::where('id_department', auth()->user()->getIdDepartment())->get(), 200);
    }

    public function create(Request $req)
    {
        DB::transaction(function() use ($req){
            expenses::insert([
                'id_department' => auth()->user()->getIdDepartment(),
                'id_arrival_material' => $req->input('id_arrival'),
                'id_user' => auth()->user()->getId(),
                'amount' => $req->input('amount'),
                'date_usage' => $req->input('date'),
                'date_record' => date('Y-m-d'),
                'id_moving_type' => 2
            ]);
        });
    }

    public function create_correct(Request $req)
    {
        DB::transaction(function() use ($req){
            correction::insert([
            'id_user' => auth()->user()->getId(),
            'id_department' => auth()->user()->getIdDepartment(),
            'id_outgo' => $req->input('id_outgo'),
            'corrected_amount' => $req->input('corrected_amount'),
            'reason_correct' => $req->input('reason_correct'),
            'spent_amount' => $req->input('spent_amount'),
            'created_at' => date('Y-m-d'),
            'id_status' => 1
            ]);
        });
    }

    public function renewal(Request $req, $id)
    {
        DB::transaction(function() use ($req, $id){
            reagent_arrival_material::where('id', $id)->update(['shelf_life' => $req['renewal']['date']]);
            expenses::insert([
                'id_department' => auth()->user()->getIdDepartment(),
                'id_arrival_material' => $req->input('id_arrival'),
                'id_user' => auth()->user()->getId(),
                'amount' => $req->input('amount'),
                'date_usage' => $req->input('date'),
                'date_record' => date('Y-m-d'),
                'id_moving_type' => 4
            ]);
        });
    }
}
