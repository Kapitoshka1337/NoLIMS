<?php
namespace app\modules\reagent\controllers;
use Yii;
use yii\web\Controller;
use app\modules\reagent\models\view_writeoff_index;
use app\modules\reagent\models\material;
use app\modules\reagent\models\department;
use app\modules\reagent\models\view_outgo_index;

class ExpensesController extends Controller
{
	public $layout = 'main_other';
	
	public function beforeAction($action)
	{
		if ($action->id == 'get-writeoff')
		{
			$this->enableCsrfValidation = false;
		}
		return parent::beforeAction($action);
	}

	public function actionIndex()
	{
		return $this->render('index');
	}

	public function actionGetExpenses()
	{
		$outgo = view_outgo_index::find()->where(['id_department' => Yii::$app->user->identity['id_department']])->all();
		return $this->asJson($outgo);
	}

	public function actionWriteoff()
	{
		return $this->render('writeoff');	
	}

	public function actionGetWriteoff()
	{
		if(Yii::$app->request->isPost)
		{
			$data = Yii::$app->request->post(); 
			$writeoff = view_writeoff_index::find()->where(['id_department' => Yii::$app->user->identity['id_department']])->andWhere(['between', 'date_usage', $data['start'], $data['end']])->all();
			$materials = material::find()->all();
			$arr = array();
			$mat = array();
			$amount = 0;
			foreach ($materials as $material)
			{
				foreach ($writeoff as $wt)
				{
					if($material->id == $wt->material_id && $wt->date_usage != null)
					{
						$amount += $wt->amount_outgo; 
						// $mat[] = array(
						// 		'material_id' => $material->id,
						// 		'date_create' => $wt->date_create,
						// 		'date_usage' => $wt->date_usage,
						// 		// 'amount_outgo' => $wt->amount_outgo,
						// );
						// $date_usage = $wt->date_usage;
						$date_create = $wt->date_create;
						$amount_arrival = $wt->amount_arrival;
						$measure = $wt->measure;
						$packing_name = $wt->packing_name;
					}
				}
				if($amount != 0)
				{
				$arr[] = array(
					'material_id' => $material->id,
					'date_create' => $date_create,
					'material' => $material->title,
					'packing_name' => $packing_name,
					'measure' => $measure,
					'amount_arrival' => $amount_arrival,
					'amount_outgo_total' => round($amount, 4),
					'date_usage' => $date_usage
				);
				$amount = 0;
				// unset($mat);
				}
			}
			return $this->asJson($arr);
		}
	}
}
