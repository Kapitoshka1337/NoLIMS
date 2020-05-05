<?php
namespace app\modules\reagent;

use yii\base\BootstrapInterface;
use yii\web\GroupUrlRule;

class Bootstrap implements BootstrapInterface
{
    public $urlRules = [
        'prefix' => 'reagent',
        'rules' => [
            '' => 'global/',
            //ERRORS
            'error/' => 'errors/error',
            'get-error/' => 'errors/get-error',
            'submit-error/' => 'errors/submit-error',
            'approve-error/' => 'errors/approve-error',
            'declining-error/' => 'errors/declining-error',
            //
            // 'archive/view/<id:\d+>' => 'archive/view',
            // 'get-big-data/' => 'arrival/get-big-data',
            // 'get-type/' => 'arrival/get-type',
            // 'get-materials/' => 'arrival/get-materials',
            // 'get-measure/' => 'arrival/get-measure',
            //STORAGE
            'get-storage/' => 'storage/get-storage',
            'material-to-archive/' => 'storage/material-to-archive',
            'expense-material/' => 'storage/expense-material',
            'upload-file/' => 'storage/upload-file',
            'get-passport/' => 'storage/get-passport',
            //
            //DEPARTMENT
            'get-department/' => 'arrival/get-department',
            //
            //ARRIVALS
            'new-arrival/' => 'arrival/new-arrival',
            'get-arrivals/' => 'arrival/get-arrivals',
            //
            //MATERIAL
            'get-material/' => 'arrival/get-material',
            'create-material/' => 'arrival/create-material',
            'edit-material/' => 'arrival/edit-material',
            'delete-material/' => 'arrival/delete-material',
            //
            //EXPENSES
            'get-expenses/' => 'expenses/get-expenses',
            //
            //HANDOFF
            'request-handoff/' => 'handoff/request-handoff',
            'history-handoff/' => 'handoff/history-handoff',
            'send-request/' => 'handoff/send-request',
            'get-history/' => 'handoff/get-history',
            'approve-request/' => 'handoff/approve-request',
            'declining-request/' => 'handoff/declining-request',
            //
            //LOCATION
            'get-location/' => 'location/get-location',
            'create-location/' => 'location/create-location',
            'create-location/' => 'location/create-location',
            'edit-location/' => 'location/edit-location',
            'delete-location/' => 'location/delete-location',
            //
            //WRITEOFF
            'writeoff/' => 'expenses/writeoff',
            'get-writeoff/' => 'expenses/get-writeoff',
            //
            //ARCHIVE
            'get-archive/' => 'archive/get-archive'
            //
        ],
    ];

    public function bootstrap($app)
    {
        $app->get('urlManager')->rules[] = new GroupUrlRule($this->urlRules);
    }
}