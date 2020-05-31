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
            'get-doc-type' => 'metrolog/get-doc-type',
            'upload-file' => 'metrolog/upload-file',
            'append' => 'metrolog/append-equipment',
            'equipments' => 'metrolog/equipments',
            'save-equipment' => 'metrolog/save-equipment',
            'change-check' => 'metrolog/change-check',
            'set-tag' => 'metrolog/set-tag',
            'set-handoff' => 'metrolog/set-handoff',
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