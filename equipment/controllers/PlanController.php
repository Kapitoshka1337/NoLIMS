<?php
namespace app\modules\equipment\controllers;
use Yii;
use yii\web\Controller;
use app\modules\equipment\models\location;

class PlanController extends Controller
{
	public function actionIndex()
	{
		return $this->render('index');
	}
}