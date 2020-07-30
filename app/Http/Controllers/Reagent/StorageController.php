<?php

namespace App\Http\Controllers\Reagent;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

use App\Models\Reagent\storage;
use App\Models\Reagent\arrival_material;

// use Illuminate\Support\Facades\Auth;

class StorageController extends Controller
{
    public function view()
    {
        // try {
        //     $user = auth()->userOrFail();
        // } catch (\Tymon\JWTAuth\Exceptions\UserNotDefinedException $e) {
        //     return response()->json($e->getMessage(), 401);
        // }
        return response()->json(storage::where('id_department', auth()->user()->getIdDepartment())->where('archive', 0)->get(), 200);
    }

    public function viewAll()
    {
        return response()->json(storage::where('id_department', '!=',auth()->user()->getIdDepartment())->get(), 200);
    }

    public function viewArchive()
    {
        return response()->json(storage::where('id_department', auth()->user()->getIdDepartment())->where('archive', 1)->get(), 200);   
    }

    public function toArchive(Request $req)
    {
        DB::transaction(function() use($req){
            arrival_material::where('id', $req->input('id'))->update(['archive' => 1]);
        });
    }
}
