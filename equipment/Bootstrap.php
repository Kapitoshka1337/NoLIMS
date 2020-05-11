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
            'get-department' => 'metrolog/get-department',
            'get-type' => 'metrolog/get-type',
            'get-doc-type' => 'metrolog/get-doc-type',
            'upload-file' => 'metrolog/upload-file',
            'append' => 'metrolog/append-equipment',
            'equipments' => 'metrolog/equipments',
            'change-check' => 'metrolog/change-check',
            'set-tag' => 'metrolog/set-tag',
            'set-handoff' => 'metrolog/set-handoff',
            'details/<id:\d+>'=>'metrolog/details',
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