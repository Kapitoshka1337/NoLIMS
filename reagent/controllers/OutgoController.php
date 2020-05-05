<?php
namespace app\modules\reagent\controllers;
use yii\web\Controller;

class OutgoController extends Controller
{
	public $layout = 'main_other';
	
	public function actionIndex()
	{
		return $this->render('index');
	}
}
