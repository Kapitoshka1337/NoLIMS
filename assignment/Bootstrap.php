<?php
namespace app\modules\assignment;

use yii\base\BootstrapInterface;
use yii\web\GroupUrlRule;

class Bootstrap implements BootstrapInterface
{
    private $urlRules = [
        'prefix' => 'assignment',
        'rules' => [
            '' => 'assignment/',
            'report' => 'assignment/report',
            'view' => 'plan/view',
            'add' => 'assignment/add',
            'get-data' => 'assignment/get-data',
            'get-vetstation' => 'assignment/get-vetstation',
            'get-region' => 'assignment/get-region',
            'get-farm' => 'assignment/get-farm',
            'get-method' => 'assignment/get-method',
            'get-empl' => 'assignment/get-empl',
            'get-report' => 'assignment/get-report',
            'create-record' => 'assignment/create-record',
            'create-farm' => 'assignment/create-farm',
            'plan-create' => 'plan/plan-create',
            'edit' => 'plan/edit',
            'get-edit' => 'plan/get-edit',
            'plan-create-block' => 'plan/plan-create-block',
            'plan-create-block1/<id:\d+>' => 'plan/plan-create-block',
            'edit/<id:\d+>'=>'plan/update',
            'delete-plan/<id:\d+>'=>'plan/delete-plan',
            'delete-block/<id:\d+>'=>'plan/delete-block',
            'update' => 'plan/update',
            'animal' => 'method/animal',
            'method' => 'method/method',
            'get-animal' => 'method/get-animal',
            'get-methods' => 'method/get-methods',
            'delete-animal'=>'method/delete-animal',
            'delete-method'=>'method/delete-method',
            'create-animal'=>'method/create-animal',
            'create-method'=>'method/create-method',
            'edit-animal'=>'method/edit-animal',
            'edit-method'=>'method/edit-method',
            'farm'=>'method/farm',
            'get-farms'=>'method/get-farms',
            'edit-farm'=>'method/edit-farm',
            'delete-farm'=>'method/delete-farm',
        ],
    ];

    public function bootstrap($app)
    {
        $app->get('urlManager')->rules[] = new GroupUrlRule($this->urlRules);
    }

    public static function getRules()
    {
        return $this->urlRules;
    }
}