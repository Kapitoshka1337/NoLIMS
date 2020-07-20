<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
	return $request->user();
});

Route::prefix('reagent')->group(function () {
	Route::prefix('storage')->group(function(){
		Route::get('', 'Reagent\StorageController@view');
		Route::post('expenses', 'Reagent\ExpensesController@create');
		Route::post('archive', 'Reagent\StorageController@toArchive');
	});
	Route::prefix('arrivals')->group(function(){
	Route::get('', 'Reagent\ArrivalsController@view');
	});
    Route::prefix('expenses')->group(function(){
    	Route::get('', 'Reagent\ExpensesController@view');
    	Route::post('correct', 'Reagent\ExpensesController@correct');
    });
});