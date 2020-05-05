<?php
namespace app\modules\reagent\controllers;
use Yii;
use yii\web\Controller;
use app\modules\reagent\models\handoff;
use app\modules\reagent\models\handoff_materials;
use app\modules\reagent\models\view_handoff_history;
use app\modules\reagent\models\material;
use app\modules\reagent\models\department;
use app\modules\reagent\models\arrivals;
use app\modules\reagent\models\arrival_material;
use app\modules\reagent\models\outgo;
use common\models\User;

class HandoffController extends Controller
{
	public $layout = 'main_other';
	
	public function beforeAction($action)
	{
		if ($action->id == 'send-request' || $action->id == 'approve-request' || $action->id == 'declining-request')
		{
			$this->enableCsrfValidation = false;
		}
		return parent::beforeAction($action);
	}

	public function actionRequestHandoff()
	{
		return $this->render('request');
	}

	public function actionHistoryHandoff()
	{
		return $this->render('history');
	}

	public function actionSendRequest()
	{
		if(Yii::$app->request->isPost)
		{
			$posts = Yii::$app->request->post();
			// return $this->asJson($posts);
			$handoff = new handoff();
			$handoff->id_department_from = Yii::$app->user->identity['id_department'];//ИЗ МОДЕЛИ USER
			$handoff->id_department_to = $posts[0]['id_department_to'];
			$handoff->id_user = Yii::$app->user->identity['id'];//ИЗ МОДЕЛИ USER
			$handoff->date_request = $posts[0]['date_request'];
			$handoff->id_handoff_status = 1;
			if($handoff->save())
			{
				foreach ($posts[0]['materials'] as $material)
				{
					$hand_mat = new handoff_materials();
					$hand_mat->id_handoff = $handoff->id;
					$hand_mat->id_arrival_material = $material['id_arrival_material'];
					$hand_mat->amount = $material['amount'];
					$hand_mat->id_location = $material['location'];
					if($hand_mat->save()) $add[] = array($handoff, $hand_mat);
				}
			}
			return $this->asJson($add);
		}
	}

	public function actionGetHistory()
	{
		if(Yii::$app->request->isGet)
		{
			if(Yii::$app->request->get('status') == 1)
			{
				$handoffs = handoff::find()->select(['id','id_department_from','id_department_to','DATE_FORMAT(date_request, "%d.%m.%Y") AS "date_request"','DATE_FORMAT(date_handoff, "%d.%m.%Y") AS "date_handoff"','id_handoff_status'])->where(['id_department_from' => Yii::$app->user->identity['id_department']])->orWhere(['id_department_to' => Yii::$app->user->identity['id_department']])->andWhere(['id_handoff_status' => Yii::$app->request->get('status')])->asArray()->all();
				$arr = array();
				foreach ($handoffs as $handoff)
				{
					$histories = view_handoff_history::find()->where(['id' => $handoff['id']])->all();
					$handoff['materials'] = $histories;
					$arr[] = $handoff;
				}
				return $this->asJson($arr);
			}
			else if(Yii::$app->request->get('status') == 0)
			{
				$handoffs = handoff::find()->select(['id','id_department_from','id_department_to','DATE_FORMAT(date_request, "%d.%m.%Y") AS "date_request"','DATE_FORMAT(date_handoff, "%d.%m.%Y") AS "date_handoff"','id_handoff_status'])->where(['id_department_from' => Yii::$app->user->identity['id_department']])->orWhere(['id_department_to' => Yii::$app->user->identity['id_department']])->asArray()->all();
				$arr = array();
				foreach ($handoffs as $handoff)
				{
					$histories = view_handoff_history::find()->where(['id' => $handoff['id']])->all();
					$handoff['materials'] = $histories;
					$arr[] = $handoff;
				}
				return $this->asJson($arr);
			}
		}
	}

	public function actionApproveRequest()
	{
		if(Yii::$app->request->isPost)
		{
			$data = Yii::$app->request->post();
			// return $this->asJson($data[0]['materials']);
			$order = array(
				'num_order' => 0,
				'date_order' => $data[0]['date_handoff'],
				'department' => $data[0]['id_department_from']
			);
			$arrival = arrivals::createArrival($order, 3);
			if($arrival)
			{
				$arrival_material = arrival_material::createArrivalMaterials($arrival->id, $data[0]['materials']);
				if($arrival_material)
				{
					foreach ($data[0]['materials'] as $material)
					{
						$outgoData = array(
							'id' => $material['id_arrival_material'],
							'amount' => $material['amount'],
							'date_usage' => $arrival->date_order,
							'date_record' => $arrival->date_order
						);
						$outgo = outgo::spendMaterial($outgoData, 3);
					}
					if($outgo)
					{
						$handoffData = array('date_handoff' => $data[0]['date_handoff'], 'status' => 2);
						$handoff = handoff::updateHandoff($data[0]['id_handoff'], $handoffData);
						if($handoff)
							return $this->asJson($outgo);
					}
				}
			}
		}
	}

	public function actionDecliningRequest()
	{
		if(Yii::$app->request->isPost)
		{
			$data = Yii::$app->request->post();
			$handoffData = array('date_handoff' => $data[0]['date_handoff'], 'status' => 3);
			$handoff = handoff::updateHandoff($data[0]['id_handoff'], $handoffData);
		}
	}
}