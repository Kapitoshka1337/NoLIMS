<?php
namespace App\Http\Controllers\Equipment;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

use App\Models\Equipment\equipment_equipment;
use App\Models\Equipment\equipment_equipment_details;
use App\Models\Equipment\equipment_type;
use App\Models\Equipment\equipment_function_of_use;
use App\Models\Equipment\equipment_object_study;
use App\Models\Equipment\equipment_history_date_checks;
use App\Models\Equipment\equipment_history_movings;
use App\Models\Equipment\equipment_table_schedule_services;
use App\Models\Equipment\equipment_date_check;
use App\Models\Equipment\equipment_history_date_check;
use App\Models\Equipment\equipment_history_repair;
use App\Models\Equipment\equipment_schedule_services;
use App\Models\Equipment\equipment_completed_services;
use App\Models\Equipment\equipment_condition_working;
use App\Models\Equipment\equipment_moving_history;
use App\Models\Reagent\location;

class EquipmentController extends Controller
{
	public function view($id)
	{
		$eq = array(
			'equipment' => equipment_equipment_details::find($id),
			'type' => equipment_type::get(),
			'history_repair' => equipment_history_repair::where('id_equipment', $id)->get(),
			'history_checks' => equipment_history_date_checks::where('id_equipment', $id)->get(),
			'history_moving' => equipment_history_movings::where('id_equipment', $id)->get(),
			'condition_working' => equipment_condition_working::where('id_equipment', $id)->first() ? equipment_condition_working::where('id_equipment', $id)->first() : array('humidity' => null, 'pressure' => null, 'temperature' => null, 'voltage' => null, 'amperage' => null),
			'maintance' => equipment_table_schedule_services::where('id_equipment', $id)->get()
		);
		return response()->json($eq, 200);
			$cond = equipment_condition_working::where('id_equipment', $id)->get();
	}

	public function create(Request $req)
	{
		DB::transaction(function() use ($req){
			$eq = equipment_equipment::create([
					'title' => $req['title'],
					'manufacturer' => $req['manufacturer'],
					'model' => $req['model'],
					'serial_number' => $req['serial_number'],
					'date_create' => $req['date_create'],
					'inventory_number' => $req['inventory_number'],
					'number' => $req['number'],
					'id_department' => $req['id_department'],
					'id_location' => $req['id_location'],
					'id_equipment_type' => $req['id_equipment_type'],
				]);
			$location = location::where('id_department', auth()->user()->getIdDepartment())->first();
			equipment_moving_history::create([
				'id_equipment' => $eq['id'],
				'id_last_department' => auth()->user()->getIdDepartment(),
				'id_current_department' => $eq['id_department'],
				'id_last_location' => $location['id'],
				'id_current_location' => $eq['id_location'],
				'date_moving' => date('Y-m-d'),
				'id_moving_type'=> 5
			]);
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
				equipment_date_check::updateOrCreate(['id_equipment' => $req->input('id_equipment')], [
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

	//Удаление проверки
	// public function deleteVerification($id, $id_passed)
	// {
	// 	// $obj = equipment_date_check::where('id', $id_passed)->get();
	// 	// return response()->json($obj[0]->id_equipment, 200);
	// 	DB::transaction(function() use ($id, $id_passed){
	// 		$obj = equipment_date_check::where('id_equipment', $id)->get();
	// 		if($obj[0]['id'] === $id_passed)
	// 			$obj[0]->delete();
	// 		else
	// 			equipment_history_date_check::where('id', $id_passed)->delete();
	// 	});
	// 	// return response()->json(['id' => $id, 'id_passed' => $id_passed],200);
	// }

	public function moving($id, Request $req)
	{
		DB::beginTransaction();
		try
		{
			//Находим в списке перемещений последнее пермещение
			$moving = equipment_moving_history::where([
				'id_equipment' => $id
			])->orderBy('id', 'desc')->first();

			//Добавляем перемещение
			equipment_moving_history::create([
				'id_equipment' => $moving['id_equipment'],
				'id_last_department' => $moving['id_current_department'],
				'id_current_department' => $req->input('id_department'),
				'id_last_location' =>$moving['id_current_location'] ,
				'id_current_location' => $req->input('id_location'),
				'date_moving' => date('Y-m-d H:m:i'),
				'id_moving_type'=> $req->input('id_moving_type')
			]);

			//Обновляем отдел и местоположение оборудования (перемещение в отдел)
			equipment_equipment::where('id', $id)->update([
				'id_department' => $req->input('id_department'),
				'id_location' => $req->input('id_location')
			]);
		}
		catch (\Exception $e)
		{
			DB::rollback();
			return response()->json(['message' => $e->getMessage()], 400);
		}
		DB::commit();
		return response()->json([
			'history_moving' => equipment_history_movings::where('id_equipment', $id)->get(),
		]);
	}

	public function services(Request $req)
	{
		DB::transaction(function() use($req){
			equipment_schedule_services::insert($req->all());
			// equipment_completed_services::insert($req->all());
		});
	}

	public function update($id, Request $req)
	{
		DB::transaction(function() use ($id, $req){
			equipment_equipment::where('id', $id)->update($req->all());
		});
	}

	public function cupdate($id, Request $req)
	{
		DB::transaction(function() use ($id, $req){
			$cond = equipment_condition_working::where('id_equipment', $id)->first();
			if($cond != null) $cond->update($req->all());
			else equipment_condition_working::insert([
				'id_equipment' => $id,
				'temperature' => $req->input('temperature'),
				'humidity' => $req->input('humidity'),
				'pressure' => $req->input('pressure'),
				'voltage' => $req->input('voltage'),
				'amperage' => $req->input('amperage')
			]);
		});
	}

	public function iupdate($id, $inst)
	{
		DB::transaction(function() use ($id, $inst){
			equipment_equipment::where('id', $id)->update(['id_instruction' => $inst]);
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