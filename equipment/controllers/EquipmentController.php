<?php
namespace app\modules\equipment\controllers;
use Yii;
use yii\web\Controller;
use app\modules\equipment\models\location;
use app\modules\equipment\models\equipment_repair_request;
use app\modules\equipment\models\equipment_repair_requests;

class EquipmentController extends Controller
{

	public function beforeAction($action)
	{
		if ($action->id == 'append-repair')
		{
			$this->enableCsrfValidation = false;
		}
		return parent::beforeAction($action);
	}

	public function actionIndex()
	{
		return $this->render('index');
	}

	public function actionDetails()
	{
		return $this->render('details');
	}

	public function actionGetRepair()
	{
		$repair = equipment_repair_requests::find()->all();
		return $this->asJson($repair);
	}

	public function actionAppendRepair()
	{
		if(Yii::$app->request->isPost)
		{
			$data = Yii::$app->request->post();
			$repair = new equipment_repair_request();
			$repair->id_equipment = $data['id_equipment'];
			$repair->id_user = Yii::$app->user->identity['id'];
			$repair->problem = $data['description'];
			$repair->id_status = 1;
			$repair->date_request = $data['date'];
			if($repair->save())
				return Yii::$app->response->statusCode = 200;
		}
	}
}