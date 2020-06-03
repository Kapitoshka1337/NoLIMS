<?php
namespace app\modules\assignment;
use Yii;
use yii\filters\AccessControl;
use app\modules\assignment\Bootstrap;

class module extends \yii\base\Module
{
    public $controllerNamespace = 'app\modules\assignment\controllers';

    // public function beforeAction($action){

    //     if (!parent::beforeAction($action)) {
    //         return false;
    //     }
    //     if (Yii::$app->user->identity['Role'] === 'leader'){
    //         Yii::$app->getResponse()->redirect(['/']);
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }

    // public function behaviors()
    // {
    //     return [
    //         'access' => [
    //             'class' => AccessControl::className(),
    //             'rules' => [
    //                 [
    //                     'allow' => true,
    //                     'actions' => ['logout', 'index', 'add', 'report', 'view', 'get-data', 'get-region', 'get-farm', 'get-method', 'get-empl', 'get-report', 'create-farm', 'create-record'
    //                     ],
    //                     'matchCallback' => function ($rule, $action) {
    //                         return Yii::$app->user->identity['role'] === 'corporal-second';
    //                     }
    //                 ],
    //                 [
    //                     'allow' => false,
    //                     'actions' => ['edit'],
    //                     'roles' => ['corporal-second']
    //                     // 'matchCallback' => function ($rule, $action) {
    //                     //     return Yii::$app->user->identity['Role'] === 'user';
    //                     // }
    //                 ],
    //                 [
    //                     'allow' => true,
    //                     // 'actions' => [
    //                     //     'logout',
    //                     //     'index',
    //                     //     'add',
    //                     //     'report',
    //                     //     'view',
    //                     //     'edit',
    //                     //     'plan-create',
    //                     //     'delete-plan',
    //                     //     'delete-block',
    //                     //     'plan-create-block',
    //                     //     'update',
    //                     //     'farm',
    //                     //     'method',
    //                     //     'animal',
    //                     // ],
    //                     'matchCallback' => function ($rule, $action) {
    //                         return Yii::$app->user->identity['role'] === 'major';
    //                     }
    //                 ],
    //             ],
    //         ],
    //     ];
    // }

    public function init()
    {
        parent::init();
    }
}