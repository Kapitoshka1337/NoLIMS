<?php

namespace App\Http\Controllers\Researches;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\researches\samples_view;
use Illuminate\Support\Facades\DB;
use App\Models\researches\samples;

class SamplesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(samples_view::get(), 200);
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
        DB::beginTransaction();

        samples::insert([
            'id_user' => $req->input('user_name'),
            'reg_num' => $req->input('reg_num'),
            'name' => $req->input('name'),
        ]);

        DB::commit();
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
        samples::where('id', $id)->update([
            'id_user' => $req->input('id_user'),
            'reg_num' => $req->input('reg_num'),
            'name' => $req->input('name'),
            'date_current_check' => $req->input('date_current_check'),
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
