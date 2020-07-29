<?php
namespace app\modules\equipment;

use yii\base\BootstrapInterface;
use yii\web\GroupUrlRule;

class Bootstrap implements BootstrapInterface
{
    public $urlRules = [
        'prefix' => 'equipment',
        'rules' => [
            'equipment' => 'equipment/equipment',
            'get-equipments' => 'metrolog/get-equipments',
            'get-today' => 'metrolog/get-today',
            'print-sticker' => 'metrolog/print-sticker',
            'print-card' => 'metrolog/print-card',
            'get-department' => 'metrolog/get-department',
            'get-type' => 'metrolog/get-type',
            'get-object-study' => 'metrolog/get-object-study',
            'append-maintenance' => 'metrolog/append-maintenance',
            'save-maintenances' => 'metrolog/save-maintenances',
            'get-doc-type' => 'metrolog/get-doc-type',
            'get-maintenance' => 'metrolog/get-maintenance',
            'get-maintenances' => 'metrolog/get-maintenances',
            'get-verification' => 'metrolog/get-verification',
            'print-table' => 'metrolog/print-table',
            'print-protocol' => 'metrolog/print-protocol',
            'print-csm' => 'metrolog/print-csm',
            'submit-verification' => 'metrolog/submit-verification',
            'recieved-eq-before' => 'metrolog/recieved-eq-before',
            'recieved-eq-after' => 'metrolog/recieved-eq-after',
            'upload-file' => 'metrolog/upload-file',
            'append' => 'metrolog/append-equipment',
            'equipments' => 'metrolog/equipments',
            'save-equipment' => 'metrolog/save-equipment',
            'change-check' => 'metrolog/change-check',
            'save-check' => 'metrolog/save-check',
            'set-tag' => 'metrolog/set-tag',
            'set-handoff' => 'metrolog/set-handoff',
            'send-request' => 'metrolog/send-request',
            'edit/<id:\d+>'=>'metrolog/details',
            'get-details'=>'metrolog/get-details',
            'repair' => 'metrolog/repair',
            'verification' => 'metrolog/verification',
            // 'eq'=>'equipment/index',
            'details/<id:\d+>'=>'equipment/details',
            'append-repair'=>'equipment/append-repair',
            'get-repair'=>'equipment/get-repair',
            'declining-repair'=>'equipment/declining-repair',
            'approve-repair'=>'equipment/approve-repair',
            'finish-repair'=>'equipment/finish-repair',
            'get-instructions'=>'metrolog/get-instructions',
            'save-instructions'=>'metrolog/save-instructions',
            //
            'plan-graph' => 'metrolog/plan',
            'fgis' => 'metrolog/fgis',
            'save-maintenance' => 'metrolog/save-maintenance',
            'get-plan-verification' => 'metrolog/get-plan-verification',
        ],
    ];

    public function bootstrap($app)
    {
        $app->get('urlManager')->rules[] = new GroupUrlRule($this->urlRules);
    }
}