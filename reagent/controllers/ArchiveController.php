<?php

namespace app\modules\reagent\controllers;
use Yii;
use yii\web\Controller;
use app\modules\reagent\models\view_archive_index;

class ArchiveController extends Controller
{
	public function actionIndex()
	{
		return $this->render('index');
	}

	public function actionGetArchive()
	{
		$archive = view_archive_index::find()->where(['department_id' => Yii::$app->user->identity['id_department']])->all();
		return $this->asJson($archive);
	}
}