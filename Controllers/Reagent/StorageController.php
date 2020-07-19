<?php

namespace App\Http\Controllers\Reagent;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\reagent\storage;
use App\Models\reagent\arrival_material;

class StorageController extends Controller
{
    public function view()
    {
        return response()->json(storage::get(), 200);
    }

    public function toArchive(Request $req, arrival_material $arrival)
    {
        $arrival->update($req->all());
        return response()->json($arrival, 200);
    }
}
