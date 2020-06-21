<?php
namespace app\modules\equipment;

use yii\base\BootstrapInterface;
use yii\web\GroupUrlRule;

class Bootstrap implements BootstrapInterface
{
    public $urlRules = [
        'prefix' => 'equipment',
        'rules' => [
            '' => 'equipment/',
            'get-equipments' => 'metrolog/get-equipments',
            'create-sticker' => 'metrolog/create-sticker',
            'create-card' => 'metrolog/create-card',
            'get-department' => 'metrolog/get-department',
            'get-type' => 'metrolog/get-type',
            'get-object-study' => 'metrolog/get-object-study',
            'append-maintenance' => 'metrolog/append-maintenance',
            'save-maintenance' => 'metrolog/save-maintenance',
            'get-doc-type' => 'metrolog/get-doc-type',
            'get-maintenance' => 'metrolog/get-maintenance',
            'get-maintenances' => 'metrolog/get-maintenances',
            'get-verification' => 'metrolog/get-verification',
            'get-plan-verification' => 'metrolog/get-plan-verification',
            'print-table' => 'metrolog/print-table',
            'create-request' => 'metrolog/create-request',
            'submit-verification' => 'metrolog/submit-verification',
            'recieved-eq-before' => 'metrolog/recieved-eq-before',
            'recieved-eq-after' => 'metrolog/recieved-eq-after',
            'upload-file' => 'metrolog/upload-file',
            'append' => 'metrolog/append-equipment',
            'equipments' => 'metrolog/equipments',
            'save-equipment' => 'metrolog/save-equipment',
            'change-check' => 'metrolog/change-check',
            'set-tag' => 'metrolog/set-tag',
            'set-handoff' => 'metrolog/set-handoff',
            'send-request' => 'metrolog/send-request',
            'details/<id:\d+>'=>'metrolog/details',
            'get-details'=>'metrolog/get-details',
            'certification' => 'metrolog/certification',
            'verification' => 'metrolog/verification',
            'plan-graph' => 'metrolog/plan',
            'fgis' => 'metrolog/fgis',
        ],
    ];

    public function bootstrap($app)
    {
        $app->get('urlManager')->rules[] = new GroupUrlRule($this->urlRules);
    }
}