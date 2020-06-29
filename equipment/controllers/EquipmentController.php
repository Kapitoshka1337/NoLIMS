<?php
namespace app\modules\equipment\controllers;
use Yii;
use yii\web\Controller;
use app\modules\equipment\models\location;

class EquipmentController extends Controller
{
	// public $layout = 'main_other';

	public function actionIndex()
	{
		return $this->render('index');
	}

	public function actionDetails()
	{
		return $this->render('details');
	}
}