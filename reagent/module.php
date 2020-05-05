<?php
namespace app\modules\reagent;
use Yii;
use yii\filters\AccessControl;

class module extends \yii\base\Module
{
    public $controllerNamespace = 'app\modules\reagent\controllers';

    // public function behaviors()
    // {
    //     return [
    //         'access' => [
    //             'class' => AccessControl::className(),
    //             'only' => ['archive'],
    //             'rules' => [
    //                 [
    //                     'allow' => false,
    //                     'actions' => ['archive'],
    //                     'roles' => ['?'],
    //                 ],
    //             ],
    //         ],
    //     ];
    // }

    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'rules' => [
                    [
                        'allow' => true,
                        'actions' => ['logout', 'index', 'get-storage', 'material-to-archive', 'expense-material', 'get-passport', 'upload-file', 'get-archive', 'get-arrivals', 'new-arrival', 'get-material','new-arrival','get-expenses', 'get-error','submit-error', 'approve-error', 'declining-error','writeoff' , 'get-writeoff', 'request-handoff', 'history-handoff', 'send-request', 'get-history', 'approve-request', 'declining-request', 'get-department', 'get-location', 'create-location', 'edit-location', 'delete-location'
                        ],
                        'matchCallback' => function ($rule, $action) {
                            return Yii::$app->user->identity['role'] === 'corporal-third';
                        }
                    ],
                    [
                        'allow' => true,
                        'actions' => ['error'],
                        // 'roles' => ['user']
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