<?php

namespace App\Http\Controllers\Reagent;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

use App\Models\Reagent\storage;
use App\Models\Reagent\arrival_material;

use PHPJasper\PHPJasper;
use Illuminate\Support\Str;

// use Illuminate\Support\Facades\Auth;

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
        return response()->json(storage::where('id_department', '!=',auth()->user()->getIdDepartment())->get(), 200);
    }

    public function viewArchive()
    {
        return response()->json(storage::where('id_department', auth()->user()->getIdDepartment())->where('archive', 1)->get(), 200);   
    }

    public function toArchive(Request $req)
    {
        DB::transaction(function() use($req){
            arrival_material::where('id', $req->input('id'))->update(['archive' => 1]);
        });
    }

    public function print($id)
    {
            $input = public_path() . '/template/inventory.jasper';
            $output = public_path() . '/downloads/';
            $output2 = public_path() . "\downloads";
            $options = [
                'format' => ['pdf'],
                'params' => ['id_loc' => $id],
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
            // $x = $jasper->process($input, $output, $options)->output();
            // return response()->json($x, 200);
            // return response()->download($output2, '\inventory.pdf', ['Content-Type: application/pdf']);
            // return response()->streamDownload(function () { echo 'asd';}, $output . 'inventory.pdf');
            return response()->download($output2 . '\inventory.pdf')->deleteFileAfterSend();
            // return response()->file($output . '/inventory.pdf', ['Content-Type: application/pdf']);
    }
}
