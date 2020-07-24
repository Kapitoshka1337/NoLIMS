<?php

namespace App\Http\Controllers\Reagent;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

use App\Models\Reagent\location;

class LocationController extends Controller
{
    public function view()
    {
        return response()->json(location::get(), 200);
    }

    public function create(Request $req)
    {
        $location = new location();
        $location->id_department = 14;
        $location->cabinet_number = $req->input('cabinet_number');
        $location->place = $req->input('place');
        $location->notation = $req->input('notation');
        if($location->save())
            return response()->json($location, 200);
    }

    public function update($id, Request $req)
    {
        // return response()->json($req, 200);
        DB::transaction(function() use ($req, $id){
            location::where('id', $id)->update([
                'cabinet_number' => $req->input('cabinet_number'),
                'place' => $req->input('place'),
                'notation' => $req->input('notation')
            ]);
        });
    }
}
