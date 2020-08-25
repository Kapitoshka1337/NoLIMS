<?php
namespace App\Http\Controllers\Equipment;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Equipment\equipment_kit_equipment;

use PHPJasper\PHPJasper;
use Illuminate\Support\Str;

class PrinterController extends Controller
{
	public function sticker(Request $req)
	{
		$ids = implode(",", $req->input('item'));
		$input = public_path() . '/template/sticker_' . $req->input('size') . '.jasper';
		$output = public_path() . '/downloads/';
		$output2 = public_path() . "\downloads";
		$options = [
			'format' => ['pdf'],
			'params' => ['id_eq' => 'id_equipment IN ('. $ids .')'],
			'db_connection' => [
				'driver' => 'generic',
				'host' => env('DB_HOST'),
				'port' => env('DB_PORT'),
				'database' => env('DB_DATABASE'),
				'username' => env('DB_USERNAME'),
				'password' => env('DB_PASSWORD'),
				'jdbc_driver' => env('JDBC_DRIVER'),
				'jdbc_url' => env('JDBC_URL')
			]
		];
		$jasper = new PHPJasper;
		$jasper->process($input, $output, $options)->execute();
		return response()->download($output2 . "\\" . pathinfo($input, PATHINFO_FILENAME) . '.pdf')->deleteFileAfterSend();
	}

	public function table(Request $req)
	{
		return response()->json($data, 200);
	}

	public function protocol(Request $req)
	{
		// return response()->json($req->input('item'),200);
		$ids = implode(",", $req->input('item'));
		$input = public_path() . '/template/protocol.jasper';
		$output = public_path() . '/downloads/';
		$output2 = public_path() . "\downloads";
		$options = [
			'format' => ['pdf'],
			'params' => ['id_eq' => $ids, 'DataName' => $req->input('date')],
			'db_connection' => [
				'driver' => 'generic',
				'host' => env('DB_HOST'),
				'port' => env('DB_PORT'),
				'database' => env('DB_DATABASE'),
				'username' => env('DB_USERNAME'),
				'password' => env('DB_PASSWORD'),
				'jdbc_driver' => env('JDBC_DRIVER'),
				'jdbc_url' => env('JDBC_URL')
			]
		];
		$jasper = new PHPJasper;
		$jasper->process($input, $output, $options)->execute();
		return response()->download($output2 . '\protocol.pdf')->deleteFileAfterSend();
	}

	public function csm(Request $req)
	{
		$ids = implode(",", equipment_kit_equipment::select('id_equipment')->where('id_checks', $req->input('id_check'))->get()->pluck('id_equipment')->toArray());
		$input = public_path() . '/template/csm.jasper';
		$output = public_path() . '/downloads/';
		$output2 = public_path() . "\downloads";
		$options = [
			'format' => ['pdf'],
			'params' => ['id_eq' => 'id IN ('. $ids .')', 'dogovor' => $req->input('descr'), 'usr' => auth()->user()->getName()],
			'db_connection' => [
				'driver' => 'generic',
				'host' => env('DB_HOST'),
				'port' => env('DB_PORT'),
				'database' => env('DB_DATABASE'),
				'username' => env('DB_USERNAME'),
				'password' => env('DB_PASSWORD'),
				'jdbc_driver' => env('JDBC_DRIVER'),
				'jdbc_url' => env('JDBC_URL')
			]
		];
		$jasper = new PHPJasper;
		$jasper->process($input, $output, $options)->execute();
		return response()->download($output2 . '\csm.pdf')->deleteFileAfterSend();
	}
}