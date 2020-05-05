<?php
namespace app\modules\assignment\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;

class GlobalController extends Controller
{
    // public function behaviors()
    // {
    //     return [
    //         'access' => [
    //             'class' => AccessControl::className(),
    //             'only' => ['login', 'logout', 'signup', 'index', 'add', 'report', 'view', 'edit', 'plan-create', 'delete-plan', 'delete-block', 'plan-create-block', 'update', 'farm', 'method', 'animal'],
    //             'rules' => [
    //                 [
    //                     'allow' => true,
    //                     'actions' => ['login', 'signup'],
    //                     'roles' => ['?'],
    //                 ],
    //                 [
    //                     'allow' => true,
    //                     'actions' => ['logout', 'index', 'add', 'report', 'view'],
    //                     'matchCallback' => function ($rule, $action) {
    //                         return Yii::$app->user->identity['Role'] === 'user';
    //                     }
    //                 ],
    //                 [
    //                     'allow' => true,
    //                     'actions' => ['logout', 'index', 'add', 'report', 'view', 'edit', 'plan-create', 'delete-plan', 'delete-block', 'plan-create-block', 'update','farm', 'method', 'animal'],
    //                     'matchCallback' => function ($rule, $action) {
    //                     	if(Yii::$app->user->identity['Role'] === 'admin' || Yii::$app->user->identity['Role'] === 'leader')
    //                     		return true;
    //                     }
    //                 ]
    //             ],
    //         ],
    //     ];
    // }
}