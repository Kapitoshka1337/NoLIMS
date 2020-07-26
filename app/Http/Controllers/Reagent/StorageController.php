<?php

namespace App\Http\Controllers\Reagent;

use Illuminate\Http\Request;
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
        return response()->json(storage::where('id_department', auth()->user()->getIdDepartment())->get(), 200);
    }

    public function toArchive(Request $req)
    {
        $arrival_mat = arrival_material::find($req->input('id'));
        $arrival_mat->archive = 1;
        if($arrival_mat->save())
        	return response()->json($arrival_mat, 200);
    }
}
