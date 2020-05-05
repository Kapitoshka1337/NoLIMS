<?php
namespace app\modules\reagent\controllers;
use Yii;
use yii\web\Controller;

class GlobalController extends Controller
{
	public function actionIndex()
	{
		return $this->render('index');
	}
}