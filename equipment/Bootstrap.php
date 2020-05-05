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
            'get-type' => 'metrolog/get-type',
            'append' => 'metrolog/append',
            'equipments' => 'metrolog/equipments',
            'change-check' => 'metrolog/change-check',
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