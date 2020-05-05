<?php
namespace app\modules\equipment;
use Yii;
use yii\filters\AccessControl;

class module extends \yii\base\Module
{
    public $controllerNamespace = 'app\modules\equipment\controllers';

    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'rules' => [
                    [
                        'allow' => true,
                        'actions' => ['logout', 'index', 'certification', 'verification', 'plan', 'fgis', 'equipments', 'get-equipments', 'get-type', 'append', 'change-check'
                        , 'details'
                        ],
                        'matchCallback' => function ($rule, $action) {
                            return Yii::$app->user->identity['role'] === 'corporal-third';
                        }
                    ],
                ],
            ],
        ];
    }

    public function init()
    {
        parent::init();
    }
}