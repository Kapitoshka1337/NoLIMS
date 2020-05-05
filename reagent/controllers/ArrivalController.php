<?php

namespace app\modules\reagent\controllers;
use Yii;
use yii\web\Controller;
use app\modules\reagent\models\NewArrivalForm;
use app\modules\reagent\models\type;
use app\modules\reagent\models\material;
use app\modules\reagent\models\measure;
use app\modules\reagent\models\department;
use app\modules\reagent\models\arrivals;
use app\modules\reagent\models\location;
use app\modules\reagent\models\arrival_material;
use app\modules\reagent\models\view_arrival_index;
use app\modules\reagent\models\view_arrival_new;
use yii\web\UploadedFile;
use common\models\User;

class ArrivalController extends Controller
{
	public $layout = 'main_other';
	
	public function beforeAction($action)
	{
		if ($action->id == 'new-arrival' || $action->id == 'create-material' || $action->id == 'upload-file')
		{
			$this->enableCsrfValidation = false;
		}
		return parent::beforeAction($action);
	}

	public function actionIndex()
	{
		return $this->render('index');
	}

	public function actionNewArrival()
	{
		if(Yii::$app->request->isPost)
		{
			$posts = Yii::$app->request->post();
			$arrival = arrivals::createArrival1($posts[0], 1);
			if($arrival)
			{
				$arrival_material = arrival_material::createArrivalMaterials($arrival->id, $posts[0]['materials']);
				if($arrival_material)
					return $this->asJson($arrival_material);
			}
		}
		$department = department::findOne(['id' => Yii::$app->user->identity['id_department']]);
		return $this->render('new-arrival', ['department' => $department]);
	}

	public function actionGetBigData()
	{
		$materials = view_arrival_new::find()->all();
		return $this->asJson($materials);
		// $departments = department::find()->all();
		// $types = type::find()->all();
		// $locations = location::find()->all();
		// $materials = array();
		// $material = array();
		// $loc = array();
		// foreach ($departments as $department)
		// {
		// 	foreach ($locations as $location)
		// 	{
		// 		foreach ($types as $type)
		// 		{
		// 			foreach ($materialIndex as $indx)
		// 			{
		// 				if($department->id == $indx->department_id && $type->id == $indx->type_id)
		// 				{
		// 					$material[] = array(
		// 						'material_id' => $indx->material_id,
		// 						'material' => $indx->material,
		// 						'measure_id' => $indx->measure_id,
		// 						'measure' => $indx->measure
		// 					);
		// 				}
		// 			}
		// 			$materials[] = array('type_id' => $type->id,'type' => $type->title, 'material' => $material);
		// 			unset($material);
		// 		}
		// 	if($department->id == $location->id_department)
		// 		$loc[] = array(
		// 			'id' => $location->id,
		// 			// 'id_department' => $location->id_department,
		// 			'cabinet_number' => $location->cabinet_number,
		// 			'place' => $location->place,
		// 			'notation' => $location->notation
		// 		);
		// 	}
		// 	$list[] = array('department_id' => $department->id,'department' => $department->title,'locations' => $loc, 'materials' => $materials);
		// 	unset($materials);
		// 	unset($loc);
		// }
		// return $this->asJson($list);
	}

	public function actionGetType()
	{
		$type = type::find()->all();
		return $this->asJson($type);
	}

	public function actionGetMaterial()
	{
		$material = view_arrival_new::find()->all();
		return $this->asJson($material);
	}

	public function actionGetMaterials()
	{
		$material = material::find()->all();
		return $this->asJson($material);
	}

	public function actionGetMeasure()
	{
		$measure = measure::find()->all();
		return $this->asJson($measure);
	}

	public function actionGetDepartment()
	{
		$department = department::find()->orderBy(['title' => SORT_ASC])->all();
		return $this->asJson($department);
	}

	public function actionGetArrivals()
	{
		$arrivals = arrivals::find()->where(['id_department' => Yii::$app->user->identity['id_department']])->all();
		$department = department::findOne(['id' => Yii::$app->user->identity['id_department']]);
		$arrival_material = view_arrival_index::find()->where(['id_department' => Yii::$app->user->identity['id_department']])->all();
		$arr = array();
		$mat = array();
		// $depart;
		foreach ($arrivals as $arrival)
		{
			// foreach ($department as $dep)
			// {
				foreach ($arrival_material as $material)
				{
					if($arrival->id == $material->id)
					{
						$mat[] = array(
							'id_material' => $material->id_material,
							'type' => $material->type,
							'material' => $material->material,
							'measure' => $material->measure,
							'amount' => $material->amount,
							'date_create' => $material->date_create,
							'shelf_life' => $material->shelf_life,
						);
						// $depart = Yii::$app->user->identity['id_department'];
						$moving_type = $material->moving_type;
					}
				}
			// }
			$date = date_create($arrival->date_order);
			$arr[] = array('moving_type' => $moving_type, 'num_order' => $arrival->num_order, 'date_order' => date_format($date, 'd.m.Y'), 'department' => $department->title, 'materials' => $mat);
				unset($mat);

		}
		return $this->asJson($arr);
	}

	public function actionCreateMaterial()
	{
		if(Yii::$app->request->isPost)
		{
			$data = Yii::$app->request->post();
			$model = new material();
			$model->id_type = $data['materialType'];
			$model->id_department = $data['materialDepartment'];
			$model->title = $data['materialName'];
			$model->id_measure = $data['materialMeasure'];
			if($model->save())
				return $this->asJson($model);
		}
	}

	public function actionEditMaterial()
	{
		if(Yii::$app->request->isGet)
		{
			$query = material::find()->where(['id' => Yii::$app->request->get('id')])->one();
			if($query)
			{
				$query->id_type = Yii::$app->request->get('type');
				$query->title = Yii::$app->request->get('material');
				$query->id_measure = Yii::$app->request->get('measure');
				if($query->save())
					return $this->asJson($query);
			}
		}
	}

	public function actionDeleteMaterial()
	{
		if(Yii::$app->request->isGet)
		{
			$query = material::find()->where(['id' => Yii::$app->request->get('id')])->one();
			$query->delete();
			return $this->asJson($query);
		}
	}
}