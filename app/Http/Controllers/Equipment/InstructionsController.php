<?php
namespace App\Http\Controllers\Equipment;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Models\Equipment\instructions;

class InstructionsController extends Controller
{
	public function view()
	{
		return response()->json(instructions::get(), 200);
	}

	public function create(Request $req)
	{
		if($req->hasFile('file'))
		{
			DB::beginTransaction();
			try
			{
				//Сохранение файла на сервере
				$path = $req->file('file')->store('uploads');
				$filename = pathinfo($path, PATHINFO_BASENAME);
				//Добавление инструкции
				instructions::insert([
					'number' => $req->input('number'),
					'title' => $req->input('title'),
					'file' => $filename
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
		else return response()->json(['message' => "Не прикреплен файл"], 400);
	}

	public function update($id, Request $req)
	{
		DB::beginTransaction();
		try
		{
			if($req->hasFile('file'))
			{
				$path = $req->file('file')->store('uploads');
				$filename = pathinfo($path, PATHINFO_BASENAME);
				$inst = instructions::where('id', $id)->get();		
				$inst[0]->update(['number' => $req->input('number'),'title' => $req->input('title'),'file' => $filename]);
			}
			else instructions::where('id', $id)->update(['number' => $req->input('number'),'title' => $req->input('title')]);
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
