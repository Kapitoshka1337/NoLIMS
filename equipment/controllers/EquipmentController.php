<?php
namespace app\modules\equipment\controllers;
use Yii;
use yii\web\Controller;
use app\modules\equipment\models\location;
use app\modules\equipment\models\equipment_repair_request;
use app\modules\equipment\models\equipment_repair_requests;
use app\modules\equipment\models\equipment_equipment;

class EquipmentController extends Controller
{

	public function beforeAction($action)
	{
		if ($action->id == 'append-repair' || $action->id == 'approve-repair' || $action->id == 'declining-repair' || $action->id == 'finish-repair')
		{
			$this->enableCsrfValidation = false;
		}
		return parent::beforeAction($action);
	}

	public function actionEquipment()
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

	public function actionApproveRepair()
	{
		if(Yii::$app->request->isPost)
		{
			$data = Yii::$app->request->post();
			$repair = equipment_repair_request::find()->where(['id' => $data['id']])->one();
			$equipment = equipment_equipment::find()->where(['id' => $data['id_equipment']])->one();
			if($repair)
			{
				$repair->date_start = date('Y-m-d');//ТЕКУЩАЯ ДАТА
				$repair->id_status = 2;
				$repair->executor = Yii::$app->user->identity['id'];
				if($repair->save())
					$equipment->is_repair = true;
					if($equipment->save())
						return Yii::$app->response->statusCode = 200;
			}
		}
	}

	public function actionDecliningRepair()
	{
		if(Yii::$app->request->isPost)
		{
			$data = Yii::$app->request->post();
			$repair = equipment_repair_request::find()->where(['id' => $data['id']])->one();
			if($repair)
			{
				$repair->date_start = date('Y-m-d');//ТЕКУЩАЯ ДАТА
				$repair->date_end = date('Y-m-d');//ТЕКУЩАЯ ДАТА
				$repair->id_status = 4;
				$repair->executor = Yii::$app->user->identity['id'];
				$repair->request_report = $data['request_report'];
				if($repair->save())
					return Yii::$app->response->statusCode = 200;
			}
		}
	}

	public function actionFinishRepair()
	{
		if(Yii::$app->request->isPost)
		{
			$data = Yii::$app->request->post();
			$repair = equipment_repair_request::find()->where(['id' => $data['id']])->one();
			$equipment = equipment_equipment::find()->where(['id' => $data['id_equipment']])->one();
			if($repair)
			{
				$repair->date_start = date('Y-m-d');//ТЕКУЩАЯ ДАТА
				$repair->date_end = date('Y-m-d');//ТЕКУЩАЯ ДАТА
				$repair->id_status = 3;
				$repair->executor = Yii::$app->user->identity['id'];
				$repair->request_report = $data['request_report'];
				if($repair->save())
					$equipment->is_repair = false;
					if($equipment->save())
						return Yii::$app->response->statusCode = 200;
					return Yii::$app->response->statusCode = 200;
			}
		}
	}
}