<?php

namespace App\Http\Controllers\Reagent;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Reagent\storage;
use App\Models\Reagent\arrival_material;

class StorageController extends Controller
{
    public function view()
    {
        return response()->json(storage::get(), 200);
    }

    public function toArchive(Request $req)
    {
        $arrival_mat = arrival_material::find($req->input('id'));
        $arrival_mat->archive = 1;
        if($arrival_mat->save())
        	return response()->json($arrival_mat, 200);
    }
}
