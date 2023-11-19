<?php

namespace App\Http\Controllers\Researches;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

use App\Models\researches\samples;
use App\Models\researches\researches;
use App\Models\researches\indicators;
use App\Models\researches\provisional;
use App\Models\share\department;
use App\Models\share\users;

class ResearchesController extends Controller
{
	public function view()
	{
		return response()->json(provisional::get(), 200);

		// $eq = array(
		// 	'id' => provisional::find($id),
		// 	'id_user' => users::where('id_user', $id)->get(),
		// 	'reg_num' => provisional::get(),
		// 	'name' => provisional::get(),
		// 	'date_reg' => provisional::get(),
		// 	'id_department' => department::where('id_department', $id)->get(),
		// 	'id_indicator' => indicators::where('id_indicator', $id)->get(),
		// 	'massa' => provisional::get(),
		// 	'SI' => provisional::get(),
		// 	'metod' => provisional::get(),
		// 	'note' => provisional::get(),
		// );
		// return response()->json($eq, 200);
		// 	$cond = provisional::where('id', $id)->get();
	}

	public function create(Request $req)
	{
		DB::transaction(function () use ($req) {
			$eq = provisional::create([
				'id_user' => $req['id_user'],
				'reg_num' => $req['reg_num'],
				'name' => $req['name'],
				'date_reg' => $req['date_reg'],
				'id_department' => $req['id_department'],
				'id_indicator' => $req['id_indicator'],
				'massa' => $req['massa'],
				'SI' => $req['SI'],
				'metod' => $req['metod'],
				'note' => $req['note'],
			]);
			$eq->save();
			return redirect('/researches');
			// samples::create([
			// 	'id_user' => $eq['id_user'],
			// 	'reg_num' => $eq['reg_num'],
			// 	'name' => $eq['name'],
			// 	'dete_reg' => $eq['date_reg'],
			// ]);
		});
	}

	public function creates(Request $req)
	{
		// if($req->hasFile('file'))
		// {
		DB::beginTransaction();
		// try
		// {
		// 	//Сохранение файла на сервере
		// 	$path = $req->file('file')->store('uploads');
		// 	$filename = pathinfo($path, PATHINFO_BASENAME);
		// 	//Добавление пройденой проверки
		// 	equipment_date_check::updateOrCreate(['id_equipment' => $req->input('id_equipment')], [
		// 		'upload_file_name' => $filename,
		// 		'id_upload_document_type' => $req->input('id_upload_document_type'),
		// 		'number_document' => $req->input('number_document'),
		// 		'date_current_check' => $req->input('date_current_check'),
		// 		'date_next_check' => $req->input('date_next_check')
		// 	]);
		// }
		// catch(ValidationException $e)
		// {
		// 	Storage::disk('local')->delete($path);
		// 	DB::rollback();
		// }
		// catch(\Exception $e)
		// {
		// 	Storage::disk('local')->delete($path);
		// 	DB::rollback();
		// 	throw $e;
		// }
		DB::commit();

		// 	$this->validate($req, [
		// 		'id_user' => $req['id_user'],
		// 		'reg_num' => $req['reg_num'],
		// 		'name' => $req['name'],
		// 		'date_reg' => $req['date_reg'],
		// 		'id_department' => $req['id_department'],
		// 		'id_indicator' => $req['id_indicator'],
		// 		'massa' => $req['massa'],
		// 		'SI' => $req['SI'],
		// 		'metod' => $req['metod'],
		// 		'note' => $req['note'],
		// 	]);

		// $provisional = new provisional;
		// $provisional->name = $request->name;
		// $provisional->text = $request->text;
		// $provisional->checked = false;
		// $provisional->save();
		// return redirect('/researches');
	}
	// else return response()->json(['message' => "Не загружен файл"], 400);
	// }
}
