<?php
namespace App\Http\Controllers\Equipment;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
//
use App\Models\Equipment\equipment_equipment;
use App\Models\Equipment\equipment_equipment_details;
use App\Models\Equipment\equipment_type;
use App\Models\Equipment\equipment_function_of_use;
use App\Models\Equipment\equipment_object_study;
use App\Models\Equipment\equipment_history_date_checks;
use App\Models\Equipment\equipment_history_movings;
use App\Models\Equipment\equipment_metrolog_list_work_for_equipment;
use App\Models\Equipment\equipment_date_check;

class EquipmentController extends Controller
{
	public function view($id)
	{
		$eq = array(
			'equipment' => equipment_equipment_details::find($id),
			'type' => equipment_type::get(),
			'function' => equipment_function_of_use::get(),
			'studies' => equipment_object_study::get(),
			'history_checks' => equipment_history_date_checks::where('id_equipment', $id)->get(),
			'history_moving' => equipment_history_movings::where('id_equipment', $id)->get(),
			'maintance' => equipment_metrolog_list_work_for_equipment::where('id_equipment', $id)->get()
		);
		return response()->json($eq, 200);
	}

	public function create(Request $req)
	{
		// return response()->json($req ,200);
		DB::transaction(function() use ($req){
			equipment_equipment::create($req->all());
		});
	}

	public function passed(Request $req)
	{
		if($req->hasFile('file'))
		{
			DB::beginTransaction();
			try
			{
				//Сохранение файла на сервере
				$path = $req->file('file')->store('uploads');
				$filename = pathinfo($path, PATHINFO_BASENAME);
				//Добавление пройденой проверки
				equipment_date_check::create([
					'id_equipment' => $req->input('id_equipment'),
					'upload_file_name' => $filename,
					'id_upload_document_type' => $req->input('id_upload_document_type'),
					'number_document' => $req->input('number_document'),
					'date_current_check' => $req->input('date_current_check'),
					'date_next_check' => $req->input('date_next_check')
				]);
			}
			catch(ValidationException $e)
			{
				Storage::disk('local')->delete($path);
				DB::rollback();
			}
			catch(\Exception $e)
			{
				Storage::disk('local')->delete($path);
				DB::rollback();
				throw $e;
			}
			DB::commit();
		}
		else return response()->json(['message' => "Не загружен файл"], 400);
	}

	public function update($id, Request $req)
	{
		DB::transaction(function() use ($id, $req){
			equipment_equipment::where('id', $id)->update($req->all());
		});
	}

	public function download($name)
	{
		try
		{
			return Storage::download('uploads'. "\\" .$name);
		}
		catch (FileNotFoundException $e)
		{
			return response()->json(['message' => 'Файл не найден'] ,200);	
		}
	}
}