<?php

namespace App\Http\Controllers\Reagent;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

use App\Models\Reagent\storage;
use App\Models\Reagent\arrival_material;

use PHPJasper\PHPJasper;
use Illuminate\Support\Str;

class StorageController extends Controller
{
    public function view()
    {
        // try {
        //     $user = auth()->userOrFail();
        // } catch (\Tymon\JWTAuth\Exceptions\UserNotDefinedException $e) {
        //     return response()->json($e->getMessage(), 401);
        // }
        return response()->json(storage::where('id_department', auth()->user()->getIdDepartment())->where('archive', 0)->get(), 200);
    }

    public function viewAll()
    {
        return response()->json(storage::where('id_department', '!=',auth()->user()->getIdDepartment())->where('archive', 0)->get(), 200);
    }

    public function viewArchive()
    {
        return response()->json(storage::where('id_department', auth()->user()->getIdDepartment())->where('archive', 1)->get(), 200);   
    }

    public function toArchive($id)
    {
        DB::transaction(function() use($id){
            arrival_material::where('id',$id)->update(['archive' => 1]);
        });
    }

    public function print($id)
    {
            $input = public_path() . '/template/inventory.jasper';
            $output = public_path() . '/downloads/';
            $output2 = public_path() . "\downloads";
            $options = [
                'format' => ['pdf'],
                'params' => ['id_loc' => 'archive = 0 AND id_location = ' . $id],
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
            return response()->download($output2 . '\inventory.pdf')->deleteFileAfterSend();
    }
}
