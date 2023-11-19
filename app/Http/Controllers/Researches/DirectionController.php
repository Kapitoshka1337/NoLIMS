<?php

namespace App\Http\Controllers\Researches;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\researches\direction;
use Illuminate\Support\Facades\DB;
use App\Models\researches\samples;
use App\Models\researches\indicators;
use App\Models\researches\direction_view;

class DirectionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(direction_view::get(), 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $req)
    {

		DB::transaction(function() use ($req){
			$samp = samples::create([
                'id_user' => auth()->user()->getid(),
                'reg_num' => $req->input('reg_num'),
                'name' => $req->input('name'),
                'date_current_check' => date('Y-m-d'),
				]);
			direction::create([
                'id_samples' => $samp['id'],
                'id_indicator' => $req->input('indicator'),
                'massa' => $req->input('massa'),
                'SI' => $req->input('SI'),
                'metod' => $req->input('metod'),
                'note' => $req->input('note'),
			]);
		});

        // DB::beginTransaction();

        // samples::insert([
        //     'id_user' => $req->input('user_name'),
        //     'reg_num' => $req->input('reg_num'),
        //     'name' => $req->input('name'),
        // ]);
        // direction::insert([
        //     'id_samples' => $req->input(''),
        //     'id_indicator' => $req->input('indicator'),
        //     'massa' => $req->input('massa'),
        //     'SI' => $req->input('SI'),
        //     'metod' => $req->input('metod'),
        //     'note' => $req->input('note'),
        // ]);

        // DB::commit();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update($id, Request $req)
    {
        DB::beginTransaction();
        direction::where('id', $id)->update([
            'id_samples' => $req->input('id_sampl'),
            'id_indicator' => $req->input('id_indi'),
            'massa' => $req->input('massa'),
            'SI' => $req->input('SI'),
            'metod' => $req->input('metod'),
            'note' => $req->input('note'),
        ]);
        DB::commit();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
