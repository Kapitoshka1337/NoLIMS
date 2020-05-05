<?php
namespace app\modules\equipment\controllers;
use Yii;
use yii\web\Controller;
use app\modules\equipment\models\location;

class ArchiveController extends Controller
{
	// public $layout = 'main_other';

	public function actionIndex()
	{
		return $this->render('index');
	}
}